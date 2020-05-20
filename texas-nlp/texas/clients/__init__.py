from texas.clients.elasticsearch import ElasticsearchClient
from texas.clients.jsonl import JSONLClient
from texas.clients.csv import CSVClient
from texas.clients.texas_api import TexasApi
from texas.clients.folder_client import FolderClient

clients = {
    "ElasticSearch": ElasticsearchClient,
    "JSONL": JSONLClient,
    "CSV": CSVClient,
    "TexasApi": TexasApi,
    "Folder": FolderClient
}


def get_instance(type, params):
    Client = clients[type]
    return Client(params)


# assume there's one document per line, tokens separated by whitespace
# dictionary.doc2bow(line.lower().split())
