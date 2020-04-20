# input: list of list of words
# output: save doc2vec model in current directory

# importing necessary libraries
import gensim
from gensim import corpora
import sys
import transform_Input
from transform_Input import TransformInput
import json
import os


class Document2Vector(object):
  def __init__(self, list_of_list_of_words):
    print('Initializing the Document2vector instance')
    self.document_word_list = list_of_list_of_words


  def create_Tagged_documents(self):
    print('Creating  Tagged documents')
    for i, list_of_words in enumerate(self.document_word_list):
      yield gensim.models.doc2vec.TaggedDocument(list_of_words, [i])

  def create_training_data(self):
    print('Creating Training data')
    self.train_data = list(element for element in self.create_Tagged_documents())

  def initialize_doc2vec_model(self):
    print('Initializing Doc2Vec model')
    self.model = gensim.models.doc2vec.Doc2Vec(vector_size=100, min_count=2, epochs=40)

  def build_vocab(self):
    print('Building Vocab for Doc2vec model')
    self.model.build_vocab(self.train_data)

  def train_model(self):
    print('Training Doc2vec model')
    self.model.train(self.train_data, total_examples=self.model.corpus_count, epochs=self.model.epochs)

  def saving_model(self, path, collectionName, docFolderName):
    print('Saving Doc2Vec model')
    self.model.save(path+'/'+docFolderName+'/'+collectionName+'/Doc2vec_Model')

if __name__ == "__main__":
  # storing args from command line
  input_type = sys.argv[1]
  collectionName = sys.argv[2]
  docFolderName = sys.argv[3]
  stopwordlist = sys.argv[4]
  input_value = json.loads(sys.stdin.readlines()[0])
  # transforming input into required format
  path =  os.path.abspath(os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)), os.pardir))
  if len(stopwordlist) > 1 :
    stopwords_add = stopwordlist.split(',')
  else:
    stopwords_add = []
  
  try:
    pass
    transformed_Inp_Obj = TransformInput(input_type, input_value, stopwords_add)

    # list_of_list_of_words is [['word',..], ['word',...],....] type input
    list_of_list_of_words = transformed_Inp_Obj.transformInput()

    # Initialize Document2Vector instance with list of list of words
    doc2vec_obj = Document2Vector(list_of_list_of_words)

    # create tagged document as input for doc2vec model
    doc2vec_obj.create_training_data()

    # initialize model with vector size 100 and set min count as 2 for now
    doc2vec_obj.initialize_doc2vec_model()

    # build vocab using the training data
    doc2vec_obj.build_vocab()

    # train the model with training data
    doc2vec_obj.train_model()
    
    # once the Object is trained, save the model model for creating vectors for Docs
    doc2vec_obj.saving_model(path, collectionName, docFolderName)

  except ValueError:
    print("Invalid parameters")
  

