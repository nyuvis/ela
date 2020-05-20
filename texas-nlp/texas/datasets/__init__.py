import sys
from os import path

def dataset_from_folder(folder):
    dataset_scripts = path.join(dataset_path) 
    if dataset_scripts not in sys.path:
        sys.path.append(dataset_scripts)

class Client:
    def __init__(self, connection):
        self.connection = connection

class Dataset:
    def name(self):
        return "a"


class Manager:
    def work(self):
        return "a"