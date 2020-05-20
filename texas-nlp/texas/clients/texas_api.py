import requests

class TexasApi:
    def __init__(self, connection):
        self.url = connection.get("url")
        print(self.url)
    def query(self, query):
        response = requests.post(self.url, json=query)
        return response.json()