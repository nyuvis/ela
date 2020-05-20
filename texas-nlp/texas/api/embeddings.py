from texas.ml.embedding import embeddings
from texas.clients import get_instance

def learn_embedding(datasource, method, store):
    """
    Sample params:
    method: {
        "method": {method name}
    }
    """
    Embeding = embeddings.get(method["method"], None)
    if not Embeding: raise Exception("Unknown embedding model")
    method = dict(method)
    method.pop("method")
    embedding = Embeding()
    embedding.learn(datasource=datasource, params=method, store=store)
