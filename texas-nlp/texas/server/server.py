import zmq
import logging
import os
import subprocess
from multiprocessing import current_process, active_children
from texas.store import DataStore
from texas.server.worker import Worker
from texas.server.store_proxy import DataStoreProxy

logging.basicConfig(format='%(asctime)s : %(levelname)s : %(process)d : %(processName)s : %(threadName)s : %(message)s', level=logging.INFO)

DATA_FOLDER=os.environ["TEXAS_NLP_DATA_PATH"]  

subprocess.Popen(["jupyter", "lab",  "--ip=0.0.0.0",  "--allow-root"])

class TexasServer:
    def __init__(self):
        logging.info("Start Server")
        self.store = DataStore.get_instance(data_path=DATA_FOLDER)

    def process_request(self, push_address, request):
        worker = Worker(push_address, request, DataStoreProxy(self.store.manager()))
        worker.start()

    def start(self, pull_address, push_address):
        context = zmq.Context()
        # receive work
        consumer_receiver = context.socket(zmq.PULL)
        consumer_receiver.connect(pull_address)

        while True:
            logging.info("Waiting Request on: " + pull_address)
            logging.info("Active: " + str(active_children()))
            try:
                request = consumer_receiver.recv_json()
                logging.info("Processing Request: " + request["taskID"])
                self.process_request(push_address, request)
            except Exception as err:
                print(err)


if __name__ == "__main__":
    server = TexasServer()
    server.start("tcp://texas-api:5555", "tcp://texas-api:5556")

