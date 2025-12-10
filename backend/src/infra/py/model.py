import pickle
import re
import sys, json
# Miscellaneous
import time
import warnings
from tensorflow import keras
warnings.filterwarnings('ignore')
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'

vect = pickle.load(open('transformer.h5', 'rb'))
model = keras.models.load_model('model_spam_comment.h5')

def replace_url(comment, replacement):
    comment = str(comment)
    comment = re.sub('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', replacement, comment)
    comment = re.sub('[/]?watch(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', replacement, comment)

    return comment
def remove_encoding(comment):
    comment = str(comment) 
    
    comment = comment.replace('\ufeff', '')
    comment = comment.replace('_', ' ')
    comment = comment.replace('/', ' ')
    comment = comment.replace('.', ' ')
    comment = comment.replace(',', ' ')
    return comment
class Comment():
  def __init__(self, comment):
    self.comment = comment
  def classification(self):
    comment = self.comment.lower()
    comment = replace_url(comment, 'http')
    comment = remove_encoding(comment)
    comment = comment.split()
    comment = ' '.join(comment)
    X = [comment]
    X_test = vect.transform(X).toarray()
    predict = model.predict(X_test, verbose = 0)[0]
    return int(predict+0.5)


if __name__ == '__main__':
  data = sys.argv[1]
  comment = Comment(comment=data)
  keras.backend.clear_session()
  print(comment.classification())

