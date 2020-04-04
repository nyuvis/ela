# import packages to transform input to list of list of words
import gensim
from gensim.utils import simple_preprocess
from smart_open import smart_open
import os
import gensim.downloader as api

class ReadTextFiles(object):
    def __init__(self, dirname):
        self.dirname = dirname
        
    def __iter__(self):
        for fname in os.listdir(self.dirname):
            for line in smart_open(os.path.join(self.dirname,fname), encoding='latin'):
                yield simple_preprocess(line)


class TransformInput(object):
  def __init__(self, inputType, value):
    self.inputType = inputType
    self.value = value
  
  def __str__(self):
    return '{} {}'.format(self.inputType, self.value)
  

  def transformInput(self):
    if self.inputType == 'document_list':
      # document_list is list variable with all the data in list ['sentence or document 1', 'sentence or document 2']
      # add preprocessing here as it suits your application
      documents = self.value

      # tokenize these sentences
      texts = [[text for text in doc.split()] for doc in documents]
      return texts
    elif self.inputType == 'api':
      # api is name of the source to download list of list of words data like text8, download from the source
      texts = api.load(self.value)
      return texts
    elif self.inputType == 'file':
      # file is name of the source to read data from one file with each line being one document, value is file path
      texts = [simple_preprocess(line, deacc=True) for line in smart_open('sample.txt', encoding='utf-8')]
      return texts

    elif self.inputType == 'multiple_files':
      # multiple_files is name of the directory to read all documents, value is path to directory
      texts = ReadTextFiles(self.value)
      return texts

    else:
      raise ValueError

  def cleanInputBeforeTransform(self):
    # write code for cleaning the documents
    pass



