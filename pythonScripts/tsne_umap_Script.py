# input: list of array of vectors
# output: save projection x, y coordinate to umap_title.csv

# importing necessary libraries
import sys
import umap
import csv

class Umap_to_csv(object):
  def __init__(self, list_of_list_of_vectors):
    print('Initializing the Umap_to_csv instance with list of list of vectors')
    self.list_of_list_of_vectors = list_of_list_of_vectors


  def create_projections(self):
    print('Creating  Projections vectors')
    self.projection = umap.UMAP(n_neighbors=5,
                                min_dist=0.3,
                                metric='correlation').fit_transform(self.list_of_list_of_vectors)

  def saving_projection(self):
    print('Saving projections to csv')
    with open('umap_title.csv','w') as out:
      csv_out=csv.writer(out)
      for row in self.projection:
          csv_out.writerow(row)

if __name__ == "__main__":
  # storing args from command line
  input_list_of_vectors = sys.argv[1]
  
  try:
    # list_of_list_of_vectors is [['0.03443343',..], ['-0.3343',...],....] type input
    umap_to_csv_obj = Umap_to_csv(input_list_of_vectors)

    # creating projection 
    umap_to_csv_obj.create_projections()
    
    # once the Object is trained, save the model model for creating vectors for Docs
    umap_to_csv_obj.saving_projection()

  except ValueError:
    print("Invalid parameters")
  

