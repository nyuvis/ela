from texas.ml.projection import projections

def learn_projection(datasource, method, store):
    """
    Sample params:
    method: {
        "method": {method name}
    }
    """
    Projection = projections.get(method["method"], None)
    if not Projection: raise Exception("Unknown Projection model")
    method = dict(method)
    method.pop("method")
    projection = Projection(**method)
    return projection.learn(datasource=datasource, params=method, store=store)
