# import packages to transform input to list of list of words
import gensim
from gensim.utils import simple_preprocess
from smart_open import smart_open
import os
import gensim.downloader as api
import re

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
    self.stopwords = [
      'a’s', 'able', 'about', 'above', 'across', 'actually', 'after', 'against', 'ain’t', 'all', 'almost', 'alone', 'along', 'although', 'always', 'am', 'an', 'and', 'another', 'anyhow', 'anyone', 'anything', 
      'anywhere', 'apart', 'appear', 'are', 'aren’t', 'around', 'ask', 'asking', 'associated', 'away', 'awfully', 'be', 'become', 'becomes', 'becoming', 'beforehand', 'behind', 'being', 'beside', 'besides', 'best',
      'beyond', 'both', 'brief', 'c’mon', 'c’s', 'came', 'cannot', 'cant', 'cause', 'certainly', 'changes', 'clearly', 'come', 'comes', 'concerning', 'considering', 'contain', 'containing', 'could', 'couldn’t', 
      'course', 'described', 'despite', 'did', 'do', 'does', 'doesn’t', 'done', 'down', 'downwards', 'edu', 'eg', 'eight', 'elsewhere', 'enough', 'entirely', 'etc', 'even', 'ever', 'everyone', 'everything', 
      'everywhere', 'example', 'except', 'far', 'first', 'five', 'followed', 'for', 'former', 'formerly', 'from', 'further', 'furthermore', 'getting', 'given', 'gives', 'going', 'gone', 'got', 'had', 'hadn’t', 
      'happens', 'hasn’t', 'have', 'haven’t', 'he’s', 'hello', 'help', 'here', 'here’s', 'hereafter', 'hereupon', 'hers', 'herself', 'himself', 'his', 'hither', 'howbeit', 'however', 'i’d', 'i’ve', 'ie', 'if', 
      'in', 'inasmuch', 'inc', 'indicated', 'indicates', 'inner', 'into', 'inward', 'is', 'it’d', 'it’ll', 'it’s', 'just', 'keep', 'keeps', 'known', 'knows', 'last', 'latter', 'latterly', 'least', 'let', 'let’s',
      'like', 'little', 'look', 'looking', 'mainly', 'many', 'may', 'mean', 'meanwhile', 'merely', 'moreover', 'most', 'mostly', 'my', 'myself', 'name', 'near', 'nearly', 'necessary', 'neither', 'never', 
      'nevertheless', 'nine', 'no', 'nobody', 'none', 'nor', 'normally', 'novel', 'now', 'nowhere', 'off', 'often', 'oh', 'old', 'on', 'once', 'only', 'onto', 'or', 'otherwise', 'ought', 'our', 'out', 'outside', 
      'over', 'particular', 'particularly', 'per', 'please', 'plus', 'possible', 'provides', 'que', 'quite', 'rd', 're', 'really', 'regardless', 'regards', 'relatively', 'said', 'same', 'saw', 'says', 'second', 
      'secondly', 'seem', 'seemed', 'seeming', 'self', 'selves', 'sensible', 'seriously', 'seven', 'several', 'should', 'shouldn’t', 'since', 'some', 'somebody', 'somehow', 'sometime', 'sometimes', 'somewhat', 
      'sorry', 'specified', 'specify', 'sub', 'such', 'sup', 'take', 'taken', 'tell', 'than', 'thank', 'thanks', 'that’s', 'thats', 'the', 'them', 'themselves', 'then', 'there’s', 'thereafter', 'thereby', 'theres',
      'thereupon', 'these', 'they’ll', 'they’re', 'they’ve', 'this', 'thorough', 'thoroughly', 'three', 'through', 'throughout', 'to', 'together', 'too', 'towards', 'tried', 'tries', 'trying', 'twice', 'two', 
      'unfortunately', 'unless', 'unlikely', 'up', 'upon', 'us', 'useful', 'uses', 'using', 'various', 'very', 'via', 'want', 'wants', 'was', 'we', 'we’d', 'we’ll', 'welcome', 'well', 'went', 'what', 'what’s', 
      'whatever', 'whenever', 'where', 'where’s', 'whereby', 'wherein', 'whereupon', 'which', 'while', 'whither', 'whoever', 'whole', 'whom', 'will', 'willing', 'wish', 'without', 'won’t', 'wonder', 'yes', 'yet', 
      'you', 'you’re', 'you’ve', 'your', 'yourselves', 'zero', 'according', 'accordingly', 'afterwards', 'again', 'allow', 'allows', 'already', 'also', 'among', 'amongst', 'any', 'anybody', 'anyway', 'anyways', 
      'appreciate', 'appropriate', 'as', 'aside', 'at', 'available', 'became', 'because', 'been', 'before', 'believe', 'below', 'better', 'between', 'but', 'by', 'can', 'can’t', 'causes', 'certain', 'co', 'com', 
      'consequently', 'consider', 'contains', 'corresponding', 'currently', 'definitely', 'didn’t', 'different', 'doing', 'don’t', 'during', 'each', 'either', 'else', 'especially', 'et', 'every', 'everybody', 'ex',
      'exactly', 'few', 'fifth', 'following', 'follows', 'forth', 'four', 'get', 'gets', 'go', 'goes', 'gotten', 'greetings', 'hardly', 'has', 'having', 'he', 'hence', 'her', 'hereby', 'herein', 'hi', 'him', 
      'hopefully', 'how', 'i’ll', 'i’m', 'ignored', 'immediate', 'indeed', 'indicate', 'insofar', 'instead', 'isn’t', 'it', 'its', 'itself', 'kept', 'know', 'lately', 'later', 'less', 'lest', 'liked', 'likely', 
      'looks', 'ltd', 'maybe', 'me', 'might', 'more', 'much', 'must', 'namely', 'nd', 'need', 'needs', 'new', 'next', 'non', 'none', 'not', 'nothing', 'obviously', 'of', 'ok', 'okay', 'one', 'ones', 'other', 
      'others', 'ours', 'ourselves', 'overall', 'own', 'perhaps', 'placed', 'presumably', 'probably', 'qv', 'rather', 'reasonably', 'regarding', 'respectively', 'right', 'say', 'saying', 'see', 'seeing', 'seems', 
      'seen', 'sent', 'serious', 'shall', 'she', 'six', 'so', 'someone', 'something', 'somewhere', 'soon', 'specifying', 'still', 'sure', 't’s', 'tends', 'th', 'thanx', 'that', 'their', 'theirs', 'thence', 'there',
      'therefore', 'therein', 'they', 'they’d', 'think', 'third', 'those', 'though', 'thru', 'thus', 'took', 'toward', 'truly', 'try', 'un', 'under', 'until', 'unto', 'use', 'used', 'usually', 'value', 'viz', 'vs',
      'wasn’t', 'way', 'we’re', 'we’ve', 'were', 'weren’t', 'when', 'whence', 'whereafter', 'whereas', 'wherever', 'whether', 'who', 'who’s', 'whose', 'why', 'with', 'within', 'would', 'wouldn’t', 'you’d', 'you’ll',
      'yours', 'yourself']
  
  def __str__(self):
    return '{} {}'.format(self.inputType, self.value)
  

  def transformInput(self):
    if self.inputType == 'document_list':
      # document_list is list variable with all the data in list ['sentence or document 1', 'sentence or document 2']
      # add preprocessing here as it suits your application
      documents = self.value

      # Cleaning documents
      documentsWithoutPunctuation = [re.sub(r'[!,.:;-](?= |$)',r'',text) for text in documents]
      textsWithoutStopWords = [[word for word in simple_preprocess(str(doc)) if word not in self.stopwords] for doc in documentsWithoutPunctuation]
      return textsWithoutStopWords

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

  



