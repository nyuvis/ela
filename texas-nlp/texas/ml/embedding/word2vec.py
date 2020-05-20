import logging
import numpy as np
from texas import BASE_MODELS
from os import path
from gensim.models import KeyedVectors


DEFAULT_MODEL_NAME = "word2vec"

class Word2Vec:
    ID = "Word2Vec"

    @staticmethod
    def data_key(group=BASE_MODELS, model=DEFAULT_MODEL_NAME, data_path="", use_texas_models=False, **kargs):
        file_path = path.join(data_path, group, "models", model)
        if not path.exists(file_path) or use_texas_models:
            return "{ID}_{group}_{model}".format(ID=Word2Vec.ID, group=BASE_MODELS, model=DEFAULT_MODEL_NAME)
        return "{ID}_{group}_{model}".format(ID=Word2Vec.ID, group=group, model=model)


    @staticmethod
    def load_data(data_path, group=BASE_MODELS, model=DEFAULT_MODEL_NAME, use_texas_models=False):
        logging.info("Loading data on loader")
        file_path = path.join(data_path, group, "models", model)
        if not path.exists(file_path) or use_texas_models:
            file_path = path.join(data_path, BASE_MODELS, DEFAULT_MODEL_NAME)
        data = KeyedVectors.load_word2vec_format(file_path)
        return data

    @staticmethod
    def query(data, query):
        logging.info("Querying data on loader")
        query_type = query.get("type", None)
        if query_type == "similar":
            keywords = query.get("keywords",[])
            return [data.similar_by_word(k) if k in data else [] for k in keywords]
        else:
            keywords = query.get("keywords", [])
            keywords = [k for k in keywords if k in data]
            keywords_index = {k:i for i,k in enumerate(keywords)}
            vectors = np.array([data[k] for k in keywords_index])
            return vectors, keywords_index
