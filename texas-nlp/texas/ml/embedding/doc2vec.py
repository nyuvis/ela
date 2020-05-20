import os
import logging
import numpy as np
from os import path
from texas import BASE_MODELS
from gensim.models.doc2vec import Doc2Vec as GDoc2Vec,LabeledSentence
from texas.resources.stopwords import STOP_WORDS
from texas.clients import get_instance
from texas.processing import tokenize, clean_text
from texas.utils import Generator

DEFAULT_MODEL_NAME = "doc2vec"

class Doc2Vec:
    ID = "Doc2Vec"

    @staticmethod
    def data_key(data_path="", group=BASE_MODELS, model=DEFAULT_MODEL_NAME, use_texas_models=False, **kargs):
        file_path = path.join(data_path, group, "models", model)
        if not path.exists(file_path) or use_texas_models:
            return "{ID}_{group}_{model}".format(ID=Doc2Vec.ID, group=BASE_MODELS, model=DEFAULT_MODEL_NAME)
        return "{ID}_{group}_{model}".format(ID=Doc2Vec.ID, group=group, model=model)

    @staticmethod
    def load_data(data_path, group=BASE_MODELS, model=DEFAULT_MODEL_NAME, use_texas_models=False):
        logging.info("Loading data on loader")
        file_path = path.join(data_path, group, "models", model)
        if not path.exists(file_path) or use_texas_models:
            file_path = path.join(data_path, BASE_MODELS, DEFAULT_MODEL_NAME)
        data = GDoc2Vec.load(file_path)
        return data


    @staticmethod
    def query(data, query):
        logging.info("Querying data on loader")
        query_type = query.get("type", None)
        if query_type == "sample":
            sample_size = query.get("size", 10)
            sample_keys = list(data.docvecs.doctags)
            sample_keys = np.random.choice(sample_keys, sample_size, replace=False)
            return data.docvecs[sample_keys], sample_keys
        else:
            return data


    def get_data(self, datasource, params):
        client = get_instance(datasource["type"], datasource["connection"])
        field = datasource.get("field", None)
        query = datasource.get("query", None)
        def scan_data():
            for doc_id, text in client.scan(query=query, field=field):
                tokens = [t for t in tokenize(clean_text(text)) if t not in STOP_WORDS]
                if len(tokens) > 0:
                    yield LabeledSentence(words=tokens, tags=[doc_id])

        return scan_data


    def learn(self, datasource, params, store):
        """
        :param datasource:
        :param params: {
            workers: int
            iterations: int
            model_name: string
        }
        :param store:
        :return:
        """
        params = params or {}
        workers = params.get("workers", 1)
        iterations = params.get("iterations", 1)
        namespace = datasource.get("name", BASE_MODELS)
        model_name = params.get("model_name", DEFAULT_MODEL_NAME)
        documents = Generator(self.get_data(datasource, params))
        model = GDoc2Vec(documents, workers=workers, iter=iterations)
        model_path = store.get_data_path(namespace, "models")
        model_path = os.path.join(model_path, model_name)
        model.save(model_path)
