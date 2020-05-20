import json


def dict_get(d, path):
    for key in path:
        try:
            d = d[key]
        except KeyError:
            return None
    return d


def limit(generator, size):
    count = 0
    for d in generator:
        count += 1
        if count <= size:
            yield d
        else:
            break

def create_index(generator, key, mode="SINGLE"):
    index = {}
    for d in generator:
        if mode is "SINGLE":
            index[d[key]] = d
        elif mode is "MULTI":
            index[d[key]] = index.get(d[key], [])
            index[d[key]].append(d)
    return index



def gen_map(generator, func):
    for d in generator:
        yield func(d)

def printd(doc):
    print(json.dumps(doc, indent=4))


def remove_keys(doc, keys):
    return { key: doc[key] for key in filter(lambda k: k not in keys, doc.keys()) }

class Generator:
    def __init__(self, generator):
        self.generator = generator

    def __iter__(self):
        return self.generator()