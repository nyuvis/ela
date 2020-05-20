import os
import csv
import numpy as np
from os import path
from texas import BASE_MODELS
from gensim.models.doc2vec import Doc2Vec as GDoc2Vec,LabeledSentence
from texas.resources.stopwords import STOP_WORDS
from texas.clients import get_instance
from texas.processing import tokenize, clean_text
from sklearn.manifold import TSNE as SK_TSNE

DEFAULT_MODEL_NAME = "tsne"

class TSNE:
    ID = "tSNE"

    def __init__(self, **kargs):
        pass


    @staticmethod
    def data_key(group=BASE_MODELS, model=DEFAULT_MODEL_NAME, **kargs):
        return "{ID}_{group}_{model}" \
            .format(ID=TSNE.ID,
                    group=group,
                    model=model)

    @staticmethod
    def load_data(data_path, group=BASE_MODELS, model=DEFAULT_MODEL_NAME):
        file_path = path.join(data_path, group, "models", model)
        with open(file_path) as file:
            reader = csv.reader(file)
            reader.__next__()
            return [(row[0], (float(row[1]), float(row[2]))) for row in reader]

    @staticmethod
    def query(data, query):
        if query.get("format", "") == "vector":
            data = np.array([d[1] for d in data])

        return data


    def get_data(self, datasource, params):
        client = get_instance(datasource["type"], datasource["connection"])
        field = datasource.get("field", None)
        query = datasource.get("query", None)
        def scan_data():
            for doc_id, text in client.scan(query=query, field=field):
                tokens = [t for t in tokenize(clean_text(text)) if t not in STOP_WORDS]
                yield LabeledSentence(words=tokens, tags=[doc_id])

        return scan_data


    def learn(self, datasource, params, store):
        """
        :param datasource:
        :param params: {}
        :param store:
        :return:
        """
        params = params or {}
        if datasource["type"] == "TexasStore":
            namespace = datasource.get("namespace", BASE_MODELS)
            loader = datasource["loader"]
            query = datasource.get("query", None)
            data_matrix, data_keys = store.query(loader, query, group=namespace, model=datasource.get("model", None))
            n_components = params.get("n_components", 2)
            perplexity = params.get("perplexity", 50)
            metric = params.get("metric", "cosine")
            embedded = SK_TSNE(n_components=n_components, metric=metric, perplexity=perplexity).fit_transform(data_matrix)
            result = [[key, *embedded[idx]] for idx, key in enumerate(data_keys)]
            save_path = store.get_data_path(namespace, "models")
            model_name = params.get("model_name", DEFAULT_MODEL_NAME)
            save_path = os.path.join(save_path, model_name)
            with open(save_path, "w+") as file:
                writer = csv.writer(file, delimiter=" ")
                writer.writerows(result)
            return result


