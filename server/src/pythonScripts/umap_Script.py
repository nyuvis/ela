# input: Doc2Vec Model name, list of documents, list of document IDs
# output: save projection x, y coordinate to umap_title.csv

# importing necessary libraries
import sys
import umap
import csv
import gensim
import json
import transform_Input
from transform_Input import TransformInput
import os

class Umap_to_csv(object):
  def __init__(self, doc2Vec_model_Name, input_list_of_documents, document_id_list, path, collectionName, docFolderName):
    print('Initializing the Umap_to_csv instance with list of list of vectors')
    self.model = gensim.models.doc2vec.Doc2Vec.load(path+'/'+docFolderName+'/'+collectionName+'/models/Doc2vec_Model')
    self.input_list_of_documents = input_list_of_documents
    self.document_id_list = document_id_list
    self.cleanedInput = []
    self.docID_list = []
  
  def clean_input_list_documents(self):
    for doc_id, row in zip(self.document_id_list, self.input_list_of_documents):
      if len(row):
        self.cleanedInput.append(row)
        self.docID_list.append(doc_id)


  def infer_vectors_for_documents(self):
    print('Infer vectors for list of input documents')
    self.doc_vectors = []
    for doc in self.cleanedInput:
      # infer_vector takes doc as list of words form as input doc
      self.doc_vectors.append(self.model.infer_vector(doc))
  

  def create_projections(self):
    print('Creating Projections vectors')
    try:
      self.projection = umap.UMAP().fit_transform(self.doc_vectors)
    except Exception as e:
      print(e)
      raise e

  def saving_projection(self, path, collectionName, docFolderName):
    print('Saving projections to csv')
    with open(path+'/'+docFolderName+'/'+collectionName+'/projections/umap_proj.csv','w', newline='') as out:
      csv_out=csv.writer(out)
      if len(self.docID_list) == len(self.projection):
        csv_out.writerow(("doc_id","x", "y"))
        for doc_id, row in zip(self.docID_list, self.projection):
          csv_out.writerow((doc_id,row[0], row[1]))
      else:
        raise ValueError

if __name__ == "__main__":
  # storing args from command line
  doc2Vec_model_Name = sys.argv[1]
  input_type = sys.argv[2]
  collectionName = sys.argv[3]
  docFolderName = sys.argv[4]
  stopwordlist = sys.argv[5]
  input_stream = json.loads(sys.stdin.readlines()[0])
  input_args = input_stream.split('\n')
  input_value = json.loads(input_args[0])
  document_id_list = json.loads(input_args[1])
  
  path =  os.path.abspath(os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)), os.pardir))

  if len(stopwordlist) > 1 :
    stopwords_add = stopwordlist.split(',')
  else:
    stopwords_add = []

  
  try:

    transformed_Inp_Obj = TransformInput(input_type, input_value, stopwords_add)

    # list_of_list_of_words is [['word',..], ['word',...],....] type input
    # the input can be more refined by analyzing bigrams, trigrams and lemmatizing the words for analysis as per requirements
    list_of_list_of_words = transformed_Inp_Obj.transformInput()

    # list_of_list_of_vectors is [['0.03443343',..], ['-0.3343',...],....] type input
    umap_to_csv_obj = Umap_to_csv(doc2Vec_model_Name, list_of_list_of_words, document_id_list, path,  collectionName, docFolderName)

    # cleam input list
    umap_to_csv_obj.clean_input_list_documents()

    # infer vectors of documents
    umap_to_csv_obj.infer_vectors_for_documents()

    # creating projection 
    umap_to_csv_obj.create_projections()
    
    # once the Object is trained, save the model model for creating vectors for Docs
    umap_to_csv_obj.saving_projection(path, collectionName, docFolderName)

  except ValueError:
    print("Invalid parameters")
  

