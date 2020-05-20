import logging
from gensim.corpora import Dictionary
from texas.resources.stopwords import remove_stop
from gensim.utils import simple_preprocess
from texas.processing import sentence_split


def tokenize(text):
    return remove_stop(simple_preprocess(text, deacc=True))


class Corpus(object):
    def __init__(self, client, scan=None, mode=None, tokenizer=tokenize, cache=False):
        self.client = client
        self.scan_params = scan or {}
        self.mode = mode
        self.dictionary = None
        self.data_size = None
        self.tokenizer = tokenizer
        self.with_metadata = False

    def __len__(self):
        if self.data_size:
            return self.data_size
        else:
            count = 0
            for c in self:
                count += 1
            self.data_size = count
            return count

    def get_corpus(self, **params):
        return Corpus(self, **params)

    def get_dictionary(self):
        if not self.dictionary:
            prev_mode = self.mode
            self.mode = "tokenized"
            self.dictionary = Dictionary(self)
            self.mode = prev_mode
        return self.dictionary

    def doc2bow(self, doc):
        dictionary = self.get_dictionary()
        return dictionary.doc2bow(self.tokenizer(doc))

    def __iter__(self):
        if self.mode == "bow" or self.mode == "id_bow":
            dictionary = self.get_dictionary()
        params = dict(self.scan_params)
        if self.mode == "raw" or self.with_metadata:
            params.pop("field")
        for _id, doc in self.client.scan(**params):
            if "field" in self.scan_params:
                if self.with_metadata and "field" in self.scan_params:
                    metadata = doc
                    doc = doc[self.scan_params["field"]]

                if self.mode == "sentence":
                    sentences = sentence_split(doc)
                    for s in sentences:
                        if self.with_metadata:
                            yield _id, s, metadata
                        else:
                            yield s

                elif self.mode == "text":
                    yield doc
                elif self.mode == "bow":
                    yield dictionary.doc2bow(self.tokenizer(doc))
                elif self.mode == "id_bow":
                    yield _id, dictionary.doc2bow(self.tokenizer(doc))
                elif self.mode == "tokenized":
                    yield self.tokenizer(doc)
                elif self.mode == "raw":
                    yield _id, doc
                else:
                    yield doc
            else:
                yield _id, doc
