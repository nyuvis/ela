# input: list of list of words
# output: save csv file with topics

# importing necessary libraries
import gensim
from gensim import corpora
from gensim.models import LdaMulticore
import sys
import transform_Input
from transform_Input import TransformInput
import pandas as pd
import csv
import json
import os

class LDA_Doc(object):
  def __init__(self, list_of_list_of_words):
    print('Initializing the LDA_Doc instance')
    self.document_word_list = list_of_list_of_words


  def create_dictionary(self):
    print('Creating dictionary of words in list of list of words')
    # Dictionary could be prepared after removing stop words and lemmatizing the words
    self.dict = corpora.Dictionary(self.document_word_list)

  def create_corpus(self):
    print('Creating corpus with id for each document')
    self.corpus = [self.dict.doc2bow(line) for line in self.document_word_list]

  def create_lda_model(self):
    print('Initializing lda model')
    self.model = LdaMulticore(corpus=self.corpus,
                         id2word=self.dict,
                         random_state=100,
                         num_topics=20,
                         passes=10,
                         chunksize=1000,
                         batch=False,
                         alpha='asymmetric',
                         decay=0.5,
                         offset=64,
                         eta=None,
                         eval_every=0,
                         iterations=100,
                         gamma_threshold=0.001,
                         per_word_topics=True)

  def compute_optimal_number_of_topic(self):
    pass

  def compute_coherence_score(self):
    pass

  def compute_complexity_perplexity(self):
    pass

  def saving_topicsKeywords_to_csv(self, path, collectionName, docFolderName):
    # Saving LDA model to disk
    # self.model.save(path+'/'+docFolderName+'/'+collectionName+'/lda_model')
    print('Saving LdaModel model topics with top 10 keywords')
    topics_list = []

    for t in range(self.model.num_topics):
      topics_list.append([x[0] for x in self.model.show_topic(t)])

    with open(path+'/'+docFolderName+'/'+collectionName+'/lda_text.csv','w') as out:
      csv_out=csv.writer(out)
      for row in topics_list:
          csv_out.writerow(row)

if __name__ == "__main__":
  # storing args from command line
  input_type = sys.argv[1]
  collectionName = sys.argv[2]
  docFolderName = sys.argv[3]
  stopwordlist = sys.argv[4]
  input_value = json.loads(sys.stdin.readlines()[0])
  path =  os.path.abspath(os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)), os.pardir))
  if len(stopwordlist) > 1 :
    stopwords_add = stopwordlist.split(',')
  else:
    stopwords_add = []
  # transforming input into required format

  try:
    transformed_Inp_Obj = TransformInput(input_type, input_value, stopwords_add)

    # # list_of_list_of_words is [['word',..], ['word',...],....] type input
    # # the input can be more refined by analyzing bigrams, trigrams and lemmatizing the words for analysis as per requirements
    # list_of_list_of_words = transformed_Inp_Obj.transformInput()

    # # Initialize Document2Vector instance with list of list of words
    # lda_obj = LDA_Doc(list_of_list_of_words)

    # # create tagged document as input for doc2vec model
    # lda_obj.create_dictionary()

    # # initialize model with vector size 100 and set min count as 2 for now
    # lda_obj.create_corpus()

    # # build vocab using the training data
    # lda_obj.create_lda_model()

    # # once the Object is trained, save the model model for creating vectors for Docs
    # lda_obj.saving_topicsKeywords_to_csv(path, collectionName, docFolderName)

  except ValueError:
    print("Invalid parameters")
  

