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

class Umap_to_csv(object):
  def __init__(self, doc2Vec_model_Name, input_list_of_documents, document_id_list):
    print('Initializing the Umap_to_csv instance with list of list of vectors')
    self.model = gensim.models.doc2vec.Doc2Vec.load('model_csv_docs/'+doc2Vec_model_Name)
    self.input_list_of_documents = input_list_of_documents
    self.document_id_list = document_id_list

  def infer_vectors_for_documents(self):
    print('Infer vectors for list of input documents')
    self.doc_vectors = []
    for doc in self.input_list_of_documents:
      # infer_vector takes doc as list of words form as input doc
      self.doc_vectors.append(self.model.infer_vector(doc))
  

  def create_projections(self):
    print('Creating Projections vectors')
    self.projection = umap.UMAP().fit_transform(self.doc_vectors)

  def saving_projection(self, collectionName):
    print('Saving projections to csv')
    with open('model_csv_docs/'+collectionName+'/umap_title.csv','w') as out:
      csv_out=csv.writer(out)
      if len(self.document_id_list) == len(self.projection):
        for doc_id, row in zip(self.document_id_list, self.projection):
          csv_out.writerow((doc_id,row[0], row[1]))
      else:
        raise ValueError

if __name__ == "__main__":
  # storing args from command line
  doc2Vec_model_Name = sys.argv[1]
  input_type = sys.argv[2]
  collectionName = sys.argv[3]
  input_stream = json.loads(sys.stdin.readlines()[0])
  input_args = input_stream.split('\n')
  input_value = json.loads(input_args[0])
  document_id_list = json.loads(input_args[1])
  
  # print(document_id_list)
  # print(input_value)

  
  try:

    transformed_Inp_Obj = TransformInput(input_type, input_value)

    # list_of_list_of_words is [['word',..], ['word',...],....] type input
    # the input can be more refined by analyzing bigrams, trigrams and lemmatizing the words for analysis as per requirements
    list_of_list_of_words = transformed_Inp_Obj.transformInput()

    # list_of_list_of_vectors is [['0.03443343',..], ['-0.3343',...],....] type input
    umap_to_csv_obj = Umap_to_csv(doc2Vec_model_Name, list_of_list_of_words, document_id_list)

    # infer vectors of documents
    umap_to_csv_obj.infer_vectors_for_documents()

    # creating projection 
    umap_to_csv_obj.create_projections()
    
    # once the Object is trained, save the model model for creating vectors for Docs
    umap_to_csv_obj.saving_projection(collectionName)

  except ValueError:
    print("Invalid parameters")
  

