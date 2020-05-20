import sys
import csv
from csv import DictReader
from texas.clients.query_types import QueryType
from texas.utils import gen_map
from texas.clients.corpus import Corpus
from tqdm import tqdm
csv.field_size_limit(sys.maxsize)


class CSVClient(Corpus):
    def __init__(self, connection, prevent_len=False):
        self.file_path = connection["path"]
        self.delimiter = connection.get("delimiter", ",")
        self.cache = connection.get("cache", False)
        if self.cache:
            print("Documents will be cached")
        self.doc_cache = None
        self.prevent_len = prevent_len

    def __len__(self):
        with open(self.file_path, "r", encoding="utf-8") as data_file:
            for d in data_file:
                print(d)
                break
            return sum(1 for row in data_file)

    def write(self, generator, idField=None, fields=None, show_progress=False, raise_on_extra_field=False):
        first = next(generator)
        first_doc = first[1] if isinstance(first, tuple) else first
        if not fields:
            fields = first_doc.keys()

        with open(self.file_path, "w", encoding="utf-8", newline='') as data_file:
            extrasaction = "raise" if raise_on_extra_field else "ignore"
            writer = csv.DictWriter(data_file, fieldnames=fields,
                                    quoting=csv.QUOTE_NONNUMERIC,
                                    delimiter=self.delimiter, extrasaction=extrasaction)
            writer.writeheader()
            writer.writerow(first_doc)
            for doc in tqdm(generator):
                if isinstance(doc, tuple):
                    doc = doc[1]
                writer.writerow(doc)

    # iterate over all documents from collection

    def clear_cache():
        self.doc_cache = None

    def __read(self):
        if self.doc_cache:
            for d in self.doc_cache:
                yield d
        else:
            if self.cache:
                self.doc_cache = []
            with open(self.file_path) as data_file:
                reader = DictReader(data_file, delimiter=self.delimiter)
                for line_number, row in enumerate(reader):
                    if self.cache:
                        self.doc_cache.append((line_number, row))
                    yield line_number, row

    def scan(self, query=None, field=None, idField=None):
        for line_number, row in self.__read():
            doc = dict(row)
            try:
                if query:
                    if not query(doc):
                        continue

                if field in doc:
                    yield doc.get(idField or "id", None), doc[field]
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
