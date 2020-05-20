import os
import logging
from multiprocessing import current_process

class DataStoreProxy:
    def __init__(self, manager):
        self.manager = manager

    def query(self, loader, query, **kargs):
        logging.info("Querying Data, DataStoreProxy")
        result = self.manager.query(loader, query, **kargs)
        return result._getvalue()