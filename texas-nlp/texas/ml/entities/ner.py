import itertools


def extract(texts, nlp):
    for text in texts:
        yield nlp(text)


def add_model_entity(docs, field, entities, model, TYPE="Model", transform=None, filter=None, preprocess=None,  append=False):
    texts, docs = itertools.tee(docs)
    texts = (d.get(field, "") for _id, d in texts)
    if preprocess:
        texts = (preprocess(text) for text in texts)
    
    texts = extract(texts, model)
    # model.pipe(texts, batch_size=20, n_threads=4)
    
    for (_id, doc), data in zip(docs, texts):
        nlpInfo = doc.get("__nlp__", {})
        fieldInfo = nlpInfo.get(field, {})
        for e in entities:
            fieldInfo.pop(e, None)

        for e in data.ents:
            value = str(e.text)
            if value in entities:
                continue

            if transform:
                value = transform(value, e.label_)
            if filter and not filter(value, e.label_):
                continue

            results = fieldInfo.get(e.label_, [])
            results.append({
                "value": e.text,
                "span": [e.start_char, e.end_char]
            })
            fieldInfo[e.label_] = results

        if len(fieldInfo) > 0:
            nlpInfo[field] = fieldInfo
            doc["__nlp__"] = nlpInfo
    
        yield _id, doc
