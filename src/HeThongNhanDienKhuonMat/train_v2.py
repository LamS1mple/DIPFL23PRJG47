from architecture import * 
import os 
import cv2
import mtcnn
import pickle 
import numpy as np 
from sklearn.preprocessing import Normalizer
from tensorflow.keras.models import load_model

import mysql.connector
import datetime

x = datetime.datetime.now()
nameFile = "{}_{}_{}_{}_{}_{}".format(x.day,x.month , x.year , x.hour, x.minute,x.second)
sql = "insert into model2 (path, dateTrain, isTrain) values(%s , %s ,%s)"
val = ('encodings{}.pkl'.format(nameFile) , x, 0)

mydb = mysql.connector.connect(
    host       ="127.0.0.1",
    user="root",
    password="Lam2002",
    database="httt"
)

mycursor = mydb.cursor()

mycursor.execute(sql, val)
mydb.commit()

face_data = 'train/'
required_shape = (160,160)
face_encoder = InceptionResNetV2()
path = "facenet_keras_weights.h5"
face_encoder.load_weights(path)
face_detector = mtcnn.MTCNN()
encodes = []
encoding_dict = dict()
l2_normalizer = Normalizer('l2')


def normalize(img):
    mean, std = img.mean(), img.std()
    return (img - mean) / std

count = 0
mycursor.execute("SELECT * FROM mau2, nhan where nhanId = idNhan")
myresult = mycursor.fetchall()

for x in myresult:
  anhNguon = r'D:\IMG_HTTM\Re\\' + x[1]
#   img =  cv2.imread(anhNguon)
#   cv2.imshow('a', img)
#   cv2.waitKey()
  ten = x[5]
  try:

    img_BGR = cv2.imread(anhNguon)
    img_RGB = cv2.cvtColor(img_BGR, cv2.COLOR_BGR2RGB)

    x = face_detector.detect_faces(img_RGB)
    x1, y1, width, height = x[0]['box']
    x1, y1 = abs(x1) , abs(y1)
    x2, y2 = x1+width , y1+height
    face = img_RGB[y1:y2 , x1:x2]
            
    face = normalize(face)
    face = cv2.resize(face, required_shape)
    face_d = np.expand_dims(face, axis=0)
    encode = face_encoder.predict(face_d)[0]
    encodes.append(encode)
    print(count)
    count += 1
  except:
        print("Loi")
        pass

  if encodes:
        encode = np.sum(encodes, axis=0 )
        encode = l2_normalizer.transform(np.expand_dims(encode, axis=0))[0]
        encoding_dict[ten] = encode
    
path = 'encodings/encodings{}.pkl'.format(nameFile)
with open(path, 'wb') as file:
    pickle.dump(encoding_dict, file)






