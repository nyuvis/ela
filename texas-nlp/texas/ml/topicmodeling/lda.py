import os
from texas.clients import get_instance
from gensim.models import LdaModel
from IPython.core.display import display, HTML
from jinja2 import Template


class LDA(object):
    def __init__(self, source=None, corpus=None, client=None, corpus_specs=None):
        self.corpus = corpus
        # if sum([t is not None for t in [source, corpus, client]]) != 1:
        #     raise NameError(
        #         'You need to provide one and only one of those (source, corpus, client)')
        if source:
            client = get_instance(**source)
        if client:
            corpus_specs = corpus_specs or {}
            self.corpus = client.get_corpus(**corpus_specs)

        self.native_model = None
        self.dictionary = None

    def train(self, num_topics, alpha="auto", passes=10, eta="auto", **kargs):
        """Train Model"""
        kargs = kargs or {}
        prev_mode = self.corpus.mode
        self.corpus.mode = "bow"
        self.native_model = LdaModel(
            self.corpus,
            id2word=self.corpus.get_dictionary(),
            num_topics=num_topics,
            alpha=alpha,
            passes=passes,
            eta=eta,
            **kargs
        )
        self.corpus.mode = prev_mode

    @classmethod
    def __display(cls, data):
        template_file = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), "TopicSheet.html.jinja2")
        with open(template_file) as file_:
            template = Template(file_.read())
        html = template.render(data)
        display(HTML(html))

    def save(self, model_path):
        self.native_model.save(model_path)

    def load(self, model_path):
        self.native_model = LdaModel.load(model_path)
        self.dictionary = self.native_model.id2word
        if self.corpus:
            self.corpus.dictionary = self.native_model.id2word

    def get_topics_matrix(self, topn=10):
        data = []
        for i in range(self.native_model.num_topics):
            data.append((i, self.native_model.show_topic(i, topn=topn)))
        return data

    def get_dictionary(self):
        if self.dictionary:
            return self.dictionary
        if self.corpus:
            return self.corpus.get_dictionary()
        if self.native_model.id2word:
            return self.native_model.id2word
        return None

    def predict(self, text):
        text = self.corpus.doc2bow(text)
        result = sorted(self.native_model[text],
                        key=lambda d: d[1], reverse=True)
        return result

    def get_topic_words(self, topic, topn=10):
        return self.native_model.show_topic(topic, topn=topn)

    def compute_uniquiness_score(self, matrix, sort=False):
        num_topic = self.native_model.num_topics
        temp_dic = {}
        for topic in matrix:
            for word in topic[1]:
                w = word[0]
                count = temp_dic.get(w, 0)
                temp_dic[w] = count + 1

        for topic_idx in range(len(matrix)):
            topic = matrix[topic_idx]

            words_topic = topic[1]
            for word_idx in range(len(words_topic)):
                word = matrix[topic_idx][1][word_idx]
                words_topic[word_idx] = (*word, 1-temp_dic[word[0]]/num_topic)
            if sort:
                words_topic = sorted(
                    words_topic, key=lambda w: w[1] * w[2], reverse=True)
            topic = (topic[0], words_topic)
            matrix[topic_idx] = topic

        return matrix

    def display_topics(self, topn=20, sort_by_uniquiness=False):
        matrix = self.get_topics_matrix(topn=topn)
        matrix = self.compute_uniquiness_score(matrix, sort=sort_by_uniquiness)
        self.__display({
            "topics": matrix
        })
        return matrix

    def display_topic(self, topic_id, topn=20):
        matrix = self.get_topics_matrix(topn=topn)
        topic = [self.compute_uniquiness_score(matrix, sort=True)[0]]
        self.__display({
            "topics": topic
        })
