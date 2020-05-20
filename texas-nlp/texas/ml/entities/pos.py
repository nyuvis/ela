import itertools


def extract(texts, nlp):
    for text in texts:
        yield nlp(text)


def add_pos_entity(docs, field, selected_pos, model, TYPE="Model", transform=None, transform_label=None, filter=None, preprocess=None,  append=False):
    texts, docs = itertools.tee(docs)
    texts = (d.get(field, "") for _id, d in texts)
    if preprocess:
        texts = (preprocess(text) for text in texts)
    
    texts = extract(texts, model)
    # model.pipe(texts, batch_size=20, n_threads=4)
    
    for (_id, doc), data in zip(docs, texts):
        nlpInfo = doc.get("__nlp__", {})
        fieldInfo = nlpInfo.get(field, {})
        for e in selected_pos:
            fieldInfo.pop(e, None)

        for e in data:
            value = str(e.text)
            label = str(e.pos_)

            if transform:
                value = transform(value, label)
            if transform_label:
                label = transform_label(value, label)

            if not label in selected_pos:
                continue
            if filter and not filter(value, label):
                continue

            results = fieldInfo.get(label, [])
            results.append({
                "value": e.text
            })
            fieldInfo[label] = results

        if len(fieldInfo) > 0:
            nlpInfo[field] = fieldInfo
            doc["__nlp__"] = nlpInfo
    
        yield _id, doc
