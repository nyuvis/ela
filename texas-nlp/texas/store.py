import os
import logging
from texas.ml.embedding.word2vec import Word2Vec
from texas.ml.embedding.doc2vec import Doc2Vec
from texas.ml.projection.tsne import TSNE
from multiprocessing.managers import BaseManager
from multiprocessing import current_process

store = None


class DataStore:
    @staticmethod
    def get_instance(**params):
        global store
        if "force" in params:
            params.pop("force")
            store = DataStore(**params)
        if not store:
            store = DataStore(**params)
        if "data_path" in params:
            store.data_path = params["data_path"]

        return store

    def __init__(self, data_path):
        self.cache = {}
        self.data_path = data_path
        self._manager = None
        self.loaders = {
            "W2V": Word2Vec,
            "D2V": Doc2Vec,
            "TSNE": TSNE
        }

    def get_data_path(self, namespace, data_type):
        data_dir = os.path.join(self.data_path, namespace, data_type)
        if not os.path.exists(data_dir):
            try:
                os.makedirs(data_dir)
            except OSError as exc:  # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise

        return data_dir

    def get_namespaces(self):
        return [name for name in os.listdir(self.data_path) if os.path.isdir(os.path.join(self.data_path, name))]

    def load_data(self, key, loader, params):
        data = loader(**params)
        self.cache[key] = data

    def get_data(self, key, loader=None, params=None):
        data = self.cache.get(key, None)
        if not data:
            self.load_data(key, loader, params)
        return data

    def query(self, loader, query, **kargs):
        if isinstance(loader, str):
            loader = self.loaders[loader]
        kkargs = dict(kargs)
        kkargs["query"] = query
        kkargs["data_path"] = self.data_path

        datakey = loader.data_key(**kkargs)
        logging.info("Geting data for key: " + datakey)
        if not self.cache.get(datakey,None):
            logging.info("Loading data key: " + datakey)
            kargs["data_path"] = self.data_path
            self.cache[datakey] = loader.load_data(**kargs)
        else:
            logging.info("Using Cache")
            logging.info("Current Keys on Cache:")
            logging.info(self.cache.keys())
        data = self.cache[datakey]

        result = loader.query(data, query)
        return result


    def manager(self):
        if not self._manager:
            class DataStoreManager(BaseManager):
                pass
            DataStoreManager.register('query', self.query)
            self._manager = DataStoreManager()
            self._manager.start()
        return self._manager

