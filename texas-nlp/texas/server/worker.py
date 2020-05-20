import zmq
import logging
from multiprocessing import Process
from texas.api import RESOLVERS
from multiprocessing import current_process

class Worker(Process):
    def __init__(self, push_address, request, store):
        super().__init__()
        self.push_address = push_address

        self.request = request
        self.store = store

    def run(self):
        logging.info("Running Worker")
        taskID = self.request["taskID"]
        task = self.request["task"]

        # receive work

        result = RESOLVERS[task](store=self.store, **self.request["params"])

        context = zmq.Context()
        sender = context.socket(zmq.PUSH)
        sender.connect(self.push_address)
        sender.send_json({"taskID": taskID, "status": "Completed", "response": result})

