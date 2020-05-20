# Adapted from: github.com/aneesha/RAKE/rake.py
import operator
from texas.resources.stopwords import STOP_WORDS
from texas.processing import sentence_split, tokenize
from krovetzstemmer import Stemmer


class RakeKeywordExtractor(object):
    def __init__(self, stopwords=STOP_WORDS, top_fraction=1, stemmer=None):
        if not stemmer:
            stemmer = Stemmer()
        self.stemmer = stemmer
        self.stopwords = stopwords
        self.top_fraction = top_fraction

    def _generate_candidate_keywords(self, sentences):
        phrase_list = []
        for sentence in sentences:
            words = tokenize(sentence)
            words = [
                "/" if w in self.stopwords else self.stemmer(w) for w in words]
            phrase = []
            for word in words:
                if word == "/":
                    if phrase:
                        phrase_list.append(phrase)
                        phrase = []
                else:
                    phrase.append(word)
            if phrase:
                phrase_list.append(phrase)

        return phrase_list

    def _calculate_word_scores(self, phrase_list):
        word_frequency = {}
        word_degree = {}
        for phrase in phrase_list:
            word_list = phrase
            word_list_length = len(word_list)
            word_list_degree = word_list_length - 1
            # if word_list_degree > 3: word_list_degree = 3 #exp.
            for word in word_list:
                word_frequency.setdefault(word, 0)
                word_frequency[word] += 1
                word_degree.setdefault(word, 0)
                word_degree[word] += word_list_degree  # orig.
                # word_degree[word] += 1/(word_list_length*1.0) #exp.
        for item in word_frequency:
            word_degree[item] = word_degree[item] + word_frequency[item]

        # Calculate Word scores = deg(w)/frew(w)
        word_score = {}
        for item in word_frequency:
            word_score.setdefault(item, 0)
            # orig.
            word_score[item] = word_degree[item] / (word_frequency[item] * 1.0)
        # word_score[item] = word_frequency[item]/(word_degree[item] * 1.0) #exp.
        return word_score

    def _generate_candidate_keyword_scores(self, phrase_list, word_score):
        keyword_candidates = {}
        for phrase in phrase_list:
            word_list = phrase[:3]
            phrase = " ".join(phrase[:3])
            keyword_candidates.setdefault(phrase, 0)

            candidate_score = 0
            for word in word_list:
                candidate_score += word_score[word]
            keyword_candidates[phrase] = candidate_score

        return keyword_candidates

    def extract(self, doc):
        sentences = [s.replace("\n", "") for s in sentence_split(doc)]
        candidates = self._generate_candidate_keywords(sentences)
        scored = self._calculate_word_scores(candidates)
        result = self._generate_candidate_keyword_scores(candidates, scored)
        result = sorted(
            result.items(), key=operator.itemgetter(1), reverse=True)
        return result
