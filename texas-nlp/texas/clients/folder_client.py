import regex
import os
from texas.clients.query_types import QueryType


class FolderClient:
    def __init__(self, connection):
        self.file_path = connection["path"]
        self.file_extension = connection["file_extension"]
        self.id_pattern = connection.get("id_pattern", None)
        if self.id_pattern:
            self.id_pattern = regex.compile(self.id_pattern)
        self.folder_field = connection.get("folder_field", "folder")

    def write(self, generator, idField):
        raise NotImplemented()

    def read_path(self, data_path, file_extention, prefix=None, id_pattern=None):
        prefix = prefix or data_path
        if prefix[-1] is not "/":
            prefix += "/"
        for filename in os.listdir(data_path):
            curr_file = os.path.join(data_path, filename)
            if os.path.isfile(curr_file) and curr_file.endswith(file_extention):
                field_id = filename
                if id_pattern:
                    field_id = regex.findall(id_pattern, filename)
                    if len(field_id) == 0:
                        raise Exception("Couldn't parse id for file: " + filename)
                    else:
                        field_id = field_id[0]
                yield field_id, data_path.replace(prefix, ""), curr_file
            elif os.path.isdir(curr_file):
                for d in self.read_path(curr_file, file_extention, prefix=prefix, id_pattern=id_pattern):
                    yield d

    def get_data(self, ):
        for d in self.read_path(self.file_path, self.file_extension, id_pattern=self.id_pattern):
            with open(d[2]) as file_text:
                yield d[0], {
                    "id": d[0],
                    self.folder_field: d[1],
                    "text": file_text.read()
                }

    # iterate over all documents from collection
    def scan(self, query=None, field=None, idField=None):
        for d in self.get_data():
            yield d

    # returns an iterator for documents matrching the query
    def query(self, query, path="", query_type=QueryType.DOCUMENTS.value):
        raise NotImplemented()