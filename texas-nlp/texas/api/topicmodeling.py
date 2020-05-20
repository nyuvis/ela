from texas.ml.topicmodeling import topicmodels


def get_topic_model(datasource, method, store):
    TopicModel = topicmodels.get(method["method"], None)
    if not TopicModel: raise Exception("Unknown topic model")
    method = dict(method)
    method.pop("method")

    topicmodel = TopicModel(**method)
    result = topicmodel.get(datasource=datasource, params=method, store=store)
    return result



def compute_topic_model(datasource, method, store):
    TopicModel = topicmodels.get(method["method"], None)
    if not TopicModel: raise Exception("Unknown topic model")
    method = dict(method)
    method.pop("method")

    topicmodel = TopicModel(**method)
    result = topicmodel.get(datasource=datasource, params=method, store=store)
    return result