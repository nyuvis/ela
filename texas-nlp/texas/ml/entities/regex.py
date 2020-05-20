import regex


def add_regex_entity(docs, field, entity, pattern, TYPE, transform=None, append=False, filter=False, casesensitive=False):
    for _id, doc in docs:
        nlpInfo = doc.get("__nlp__", {})
        fieldInfo = nlpInfo.get(field, {})
        results = fieldInfo.get(entity, [])
        text = doc[field]
        if append:
            results = []
        flags = regex.IGNORECASE if not casesensitive else 0
        
        for d in regex.finditer(pattern, text, flags=flags):
            results.append({
                "value": str(d.group()),
                "span": list(d.span())
            })

        fieldInfo[entity] = results
        if len(results) > 0:
            nlpInfo[field] = fieldInfo
            doc["__nlp__"] = nlpInfo
        yield _id, doc
