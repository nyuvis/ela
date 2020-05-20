import numpy as np
from scipy.spatial.distance import cdist
from texas.clients import get_instance
from texas.resources.stopwords import STOP_WORDS

class W2V_TopFreqModel:
    def __init__(self, **kargs):
        self.store = kargs.get("store", None)

    def get(self, datasource, params, store):
        client = get_instance(datasource["type"], datasource["connection"])

        keywords_data = client.get_keywords(datasource["field"], size=params.get("keyword_samples", None))
        keywords_data = [k for k in keywords_data if k["keyword"] not in STOP_WORDS and len(k["keyword"]) >= 3]
        keywords = [k["keyword"] for k in keywords_data]

        max_words = params.get("max_words", 3)
        min_words = params.get("min_words", 2)
        min_words = min(max_words, min_words)
        threshold = params.get("threshold", 0.8)
        use_texas_models = params.get("use_texas_models", False)

        datasource_name = datasource.get("name", None)

        vectors, keywords_index = store.query("W2V", {"keywords": keywords}, group=datasource_name, use_texas_models=use_texas_models)

        clusters = []
        membership = []
        count = []


        for keyword in keywords_index:
            i = keywords_index[keyword]
            v = vectors[i]
            if len(clusters) > 0:
                dist = cdist(np.array([v]), np.array(clusters), metric="cosine")
                min_dist = np.argmin(dist)
                if (1-dist[0][min_dist]/2) > threshold:
                    curr_vector = clusters[min_dist]
                    curr_vector = curr_vector *0.9 + v * 0.1
                    clusters[min_dist] = curr_vector
                    count[min_dist] += 1
                    membership[min_dist].append(keyword)
                else:
                    count.append(1)
                    clusters.append(v)
                    membership.append([keyword])

            else:
                count.append(1)
                clusters.append(v)
                membership.append([keyword])
        return [[{"keyword": w, "weight": 1/len(group[0:max_words])} for w in group[0:max_words]] for group in membership if len(group) >= min_words]
