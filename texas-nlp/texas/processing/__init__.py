import re
from bs4 import BeautifulSoup
from krovetzstemmer import Stemmer
from texas.resources.stopwords import remove_stop

from gensim.utils import simple_preprocess

sentence_pattern = re.compile("(?<=[.?!;])\s+")
token_pattern = re.compile("[^\w']+")


def build_transformers(config):
    return make_pipeline(*[build_transform(t) for t in config])


def build_transform(config):
    if "pipeline" in config:
        funcs = [globals()[f] for f in config["pipeline"]]
        pipeline = make_pipeline(*funcs)
        if "field" in config:
            def f(docs):
                for _id, d in docs:
                    d[config["field"]] = pipeline(d[config["field"]])
                    yield _id, d
            return f
        else:
            def f(docs):
                for _id, d in docs:
                    yield _id, pipeline(d)
            return f

    return config


def make_pipeline(*funcs):
    funcs = list(funcs)

    def func(doc):
        if doc is None:
            doc = ""

        for f in funcs:
            doc = f(doc)
        return doc
    return func


stemmer = Stemmer()


def remove_urls(text):
    return re.sub(r'(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?\S', '', text, flags=re.MULTILINE)


def stem(doc):
    return [stemmer(w) for w in doc]


def remove_html(doc):
    try:
        if doc is None:
            return ""
        data = BeautifulSoup(doc, "html5lib")
        for s in data("script"):
            s.extract()
        for s in data("style"):
            s.extract()

        return data.text.replace("\\n", "\n")
    except:
        print("Document Erro", doc)
        raise


def sentence_split(text):
    return sentence_pattern.split(text.strip().lower())


def simple_tokenize(text):
    text = text.lower()
    return [t.strip() for t in token_pattern.split(text) if len(t) > 1]


def tokenize(text):
    return simple_preprocess(text)


def clean_text(text):
    text = text.replace("\\n", "\n").strip()
    return text
