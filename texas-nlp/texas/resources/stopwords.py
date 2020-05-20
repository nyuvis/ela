"""Basic stopwords list"""
import os

with open(os.path.join(os.path.dirname(__file__), 'stopwords.lst')) as f:
    STOP_WORDS = f.readlines()
    STOP_WORDS = [word.replace("\n", "") for word in STOP_WORDS]
    STOP_WORDS = set(STOP_WORDS)


def remove_stop(tokens):
    return [t for t in tokens if t not in STOP_WORDS]