import json
from texas.clients.query_types import QueryType
from texas.utils import gen_map
from texas.clients.corpus import Corpus


class JSONLClient:
    def __init__(self, connection):
        self.file_path = connection["path"]

    def get_corpus(self, mode=None, **params):
        return Corpus(self, scan=params, mode=mode)

    def write(self, generator, idField):
        with open(self.file_path, "+w", encoding="utf-8") as data_file:
            for doc in generator:
                if isinstance(doc, tuple):
                    doc = doc[1]
                data_file.write(json.dumps(doc) + "\n")

    # iterate over all documents from collection
    def scan(self, query=None, field=None, idField=None, limit=0):
        with open(self.file_path) as data_file:
            count = 0
            for line_number, line in enumerate(data_file):
                count += 1
                if limit > 0 and count > limit: 
                    break
                doc = json.loads(line, encoding="utf-8")
                try:
                    if query:
                        if not query(doc):
                            continue

                    if field in doc:
                        yield doc.get("id", None), doc[field]
                    elif field:
                        continue
                    else:
                        yield doc.get(idField or "id", line_number), doc

                except Exception as e:
                    print("Error on document number:", line_number)
                    print(doc)
                    raise(e)

    # returns an iterator for documents matrching the query
    def query(self, query, path="", query_type=QueryType.DOCUMENTS.value):
        raise NotImplemented()
