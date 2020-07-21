# input: Doc2Vec Model name, list of documents, list of document IDs
# output: save projection x, y coordinate to umap_title.csv

# importing necessary libraries
import sys
import umap
import csv
import gensim
from gensim.test.utils import datapath, get_tmpfile
from gensim.scripts.glove2word2vec import glove2word2vec
import json
import os
import shutil
import requests, zipfile, io
from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile

class word2vec_(object):
  def __init__(self, path, collectionName, docFolderName):
    print('Initializing the word2vec object')
    self.path = path
    self.collectionName = collectionName
    self.docFolderName = docFolderName

  def load_glovefiles(self):
    print('loading glove vectors')
    zipurl = 'http://nlp.stanford.edu/data/glove.6B.zip'
    with urlopen(zipurl) as zipresp:
        with ZipFile(BytesIO(zipresp.read())) as zfile:
            zfile.extractall(self.path +'/'+self.docFolderName+'/tempfile')
  

  def create_word2vec(self):
    print('Creating word2vec model')
    glove_file = datapath(self.path +'/'+self.docFolderName+'/tempfile/glove.6B.300d.txt')
    tmp_file = get_tmpfile(self.path +'/'+self.docFolderName+'/'+self.collectionName+'/word2vec')
    print('Saving the word2vec model')
    glove2word2vec(glove_file, tmp_file)


  def remove_tempfile(self):
    print('Removing tempfile')
    dirToRemove= self.path +'/'+self.docFolderName+'/tempfile'
    try:
        shutil.rmtree(dirToRemove)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))

if __name__ == "__main__":
  # storing args from command line
  docFolderName = sys.argv[2]
  collectionName = sys.argv[1]
  path =  os.path.abspath(os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)), os.pardir))
  try:
    word2vec_obj = word2vec_(path,  collectionName, docFolderName)

    # load word2vec glove file
    word2vec_obj.load_glovefiles()

    # creating word2vec and saving word2vec model
    word2vec_obj.create_word2vec()

    # removing temp file
    word2vec_obj.remove_tempfile()

  except ValueError:
    print("Invalid parameters")
  

