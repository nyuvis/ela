import time
import math
import copy
from tqdm import tqdm
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan, bulk
from texas.clients.query_types import QueryType
from texas.utils import dict_get, printd
from texas.resources.stopwords import STOP_WORDS
from texas.clients.corpus import Corpus

DYNAMIC_TAMPLATES = [
    {
        "strings": {
            "match_mapping_type": "string",
            "mapping": {
                "type": "keyword"
            }
        }
    }
]

BASE_SETTINGS = {
    "index": {
        "analysis": {
            "filter": {
                "english_keywords": {
                    "keywords": ["waitress"],
                    "type": "keyword_marker"
                },
                "english_stemmer": {
                    "type": "stemmer",
                    "language": "english"
                },
                "light_stemmer_": {
                    "name": "minimal_english",
                    "type": "stemmer"
                },
                "my_snow": {
                    "type": "snowball",
                    "language": "English"
                },
                "english_stop": {
                    "type": "stop",
                    "stopwords": list(STOP_WORDS)
                },
                "english_shingle": {
                    "max_shingle_size": "2",
                    "min_shingle_size": "2",
                    "output_unigrams": "false",
                    "type": "shingle"
                },
                "english_possessive_stemmer": {
                    "type": "stemmer",
                    "language": "possessive_english"
                }
            },
            "char_filter": {
                "html": {
                    "type": "html_strip"
                }
            },
            "analyzer": {
                "base": {
                    "filter": ["english_possessive_stemmer", "lowercase", "english_stop", "light_stemmer_"],
                    "char_filter": ["html"],
                    "tokenizer": "standard"
                },
                "keepstops": {
                    "filter": ["english_possessive_stemmer", "lowercase", "light_stemmer_"],
                    "char_filter": ["html"],
                    "tokenizer": "standard"
                }
            }
        }
    }
}


class ElasticsearchClient(Corpus):
    def __init__(self, connection):

        connection = copy.deepcopy(connection)
        hosts = connection["client"]["hosts"]

        for host in hosts:
            if "path" in host:
                host["url_prefix"] = host.pop("path")

        self.client = Elasticsearch(hosts)
        self.index = connection["index"]
        self.type = connection.get("type", "document")
        self.schema = connection.get("schema", None)
        self.settings = connection.get("settings", None)
        self.mappings = connection.get("mappings", None)

    def get_corpus(self, mode=None, **params):
        return Corpus(self, scan=params, mode=mode)

    def get_keywords(self, field, query=None, size=100):
        size = size or 100
        query = query if query else dict()
        query["size"] = 0
        query["aggs"] = {
            "keywords": {
                "terms": {
                    "field": field,
                    "size": size
                }
            }
        }

        result = self.search(query=query)
        result = result.get("aggregations", {}).get(
            "keywords", {}).get("buckets", [])
        result = [{"keyword": k["key"], "count": k["doc_count"],
                   "score": k.get("score", 1)} for k in result]
        return result

    def get_native_type(self, field):
        if field["Type"] == "TEXT":
            return {
                "type": "text",
                "analyzer": "keepstops" if "KeepStops" in field else "base",
                "fielddata": True
            }
        elif field["Type"] == "CATEGORICAL":
            return {
                "type": "keyword"
            }

        elif field["Type"] == "DATE":
            return {
                "type": "date",
                "format": field["Format"] if "Format" in field else "strict_date_optional_time||epoch_millis"
            }

        elif field["Type"] == "INTEGER":
            return {
                "type": "long",
            }

        elif field["Type"] == "DECIMAL":
            return {
                "type": "double",
            }
        raise NameError(
            "Unknown field type {ftype}".format(ftype=field["Type"]))

    def parse_schema(self, schema, settings=None, mappings=None):
        mapping = {
            "dynamic_templates": DYNAMIC_TAMPLATES,
            "properties": {field["ID"]: self.get_native_type(field) for field in schema["Fields"]}
        }

        base_settings = BASE_SETTINGS

        if mappings:
            mapping["properties"].update(mappings)

        if settings:
            base_settings.update(settings)

        return {
            "mappings": {
                self.type: mapping
            },
            "settings": base_settings
        }

    def create_repository(self, schema=None, settings=None, mappings=None):
        schema = schema or self.schema
        settings = settings or self.settings
        mappings = mappings or self.mappings

        return self.client.indices.create(
            index=self.index,
            body=self.parse_schema(schema, settings, mappings),
            ignore=400
        )

    def delete_repository(self):
        self.client.indices.delete(
            index=self.index,
            ignore=400
        )

    def write(self, data, idField=None, chunk_size=None, show_progress=False, total=None):
        def create_actions(docs):
            gen = enumerate(docs)
            if show_progress:
                gen = tqdm(gen, total=total)
            for i, doc in gen:
                _id = i
                if isinstance(doc, tuple):
                    _id = doc[0]
                    doc = doc[1]
                routing = None
                if "_routing" in doc:
                    routing = doc.pop("_routing")

                yield {
                    '_index': self.index,
                    '_type': self.type,
                    '_id': doc.get(idField) if idField else _id,
                    '_source': doc,
                    "_routing": routing
                }

        try:
            #print('Actions', list(create_actions(data)))
            bulk(self.client, create_actions(data), chunk_size=chunk_size)
        except Exception as err:
            print(err)

    def search(self, query):
        return self.client.search(index=self.index, doc_type=self.type, body=query)

    def get(self, doc_id):
        return self.client.get(index=self.index, doc_type=self.type, id=doc_id)

    def scan(self, query=None, field=None, limit=0, preserve_order=False, sample=0, raw=False, idField=None):
        query = query if query else {"query": {}}
        if sample > 0:
            preserve_order = True
            limit = sample
            if "query" not in query:
                query = query["query"] = {}
            query["query"]["function_score"] = {
                "functions": [
                    {
                        "random_score": {
                            "seed":  math.floor((time.time() - math.floor(time.time()))*100)
                        }
                    }
                ]
            }
        count = 0
        if field:
            query["_source"] = [field]

        if len(query["query"]) == 0:
            query.pop("query")

        for d in scan(self.client,
                      query=query,
                      index=self.index,
                      doc_type=self.type,
                      request_timeout=600,
                      preserve_order=preserve_order):
            if raw:
                yield d
            elif field in d["_source"]:
                yield d["_id"], d["_source"][field]
            elif field:
                continue
            else:
                yield d["_id"], d["_source"]
            count += 1
            if count >= limit > 0:
                break

    def query(self, query, path="", query_type=QueryType.DOCUMENTS.value):
        data = self.search(query)
        data = dict_get(data, path.split("."))
        if query_type == QueryType.KEYWORDS.value:
            data = [{"Keyword": k["key"], "Stat": k["doc_count"]}
                    for k in data]
        return iter(data)
