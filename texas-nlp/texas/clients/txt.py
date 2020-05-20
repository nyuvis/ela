from texas.clients.query_types import QueryType


class TXTClient:
    def __init__(self, connection):
        self.file_path = connection["path"]

    def write(self, generator):
        with open(self.file_path, "+w", encoding="utf-8") as data_file:
            for d in generator:
                data_file.write(d[0] + "||" + d[1].replace("\n", "\\n") + "\n")

    # iterate over all documents from collection
    def scan(self, query=None, field=None):
        with open(self.file_path) as data_file:
            for line in data_file:
                line = line.replace("\\n", "\n")
                if query:
                    if query(line):
                        yield line
                else:
                    yield line

    # returns an iterator for documents matrching the query
    def query(self, query, path="", query_type=QueryType.DOCUMENTS.value):
        raise NotImplemented()
