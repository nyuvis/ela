import unittest
from texas.api.topicmodeling import get_topic_model
from texas.store import DataStore

class TestTopicModeling(unittest.TestCase):
    def test_main(self):
        datasource = {
            "type": "ElasticSearch",
            "name": "agari",
            "field": "contents",
            "connection": {
                "client": {"hosts": [{"host": "elasticsearch","port": 9200}]},
                "index": "agari",
                "type": "email"
            }
        }
        yelp_datasource = {
            "type": "ElasticSearch",
            "name": "VoxNews",
            "field": "body",
            "connection": {
                "client": {"hosts": [{"host": "nyuvis-web.poly.edu","port": 80, "path":"es" }]},
                "index": "vox-news",
                "type": "vox_document"
            }
        }
        method = {
            "use_texas_models": True,
            "method": "W2V_TOP_FREQ",
            "max_words": 3,
            "min_words": 2,
            "keyword_samples": 1000,
            "threshold": 0.8
        }

        model = get_topic_model(datasource=yelp_datasource, method=method, store=DataStore.get_instance())
        for d in model:
            print([k["keyword"] for k in d])



if __name__ == '__main__':
    unittest.main()
