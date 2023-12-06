# from architecture import * 
# import os 
# import cv2
# import mtcnn
# import pickle 
# import numpy as np 
# from sklearn.preprocessing import Normalizer
# from tensorflow.keras.models import load_model
# import requests

# import mysql.connector
# import datetime
# def get_face(img, box):
#     x1, y1, width, height = box
#     x1, y1 = abs(x1), abs(y1)
#     x2, y2 = x1 + width, y1 + height
#     face = img[y1:y2, x1:x2]
#     return face, (x1, y1), (x2, y2)
# detect = mtcnn.MTCNN()

# img = cv2.imread("00000.jpg")

# faces = detect.detect_faces(img)
# vitri = faces[0]['box']
# # topLeft =  (vitri[0] , vitri[1])
# # bottomRight = (vitri[0] +  vitri[2], vitri[1] + vitri[3] )

# lam , x , y = get_face(img, vitri)
# cv2.rectangle(img ,x , y , (0,255,0),3 )
# cv2.imshow('anh',lam)
# cv2.imshow('a',img )


# cv2.waitKey()
# id = 1
# print("{id}")

import mysql.connector
mydb = mysql.connector.connect(
        host       ="127.0.0.1",
        user="root",
        password="Lam2002",
        database="httt"
)
mycursor = mydb.cursor()
for id in [1,2,4]:

    mycursor.execute("SELECT * FROM mau2, nhan where nhanId=idNhan and nhanId = {}".format(id))
    myresult = mycursor.fetchall()
    for i in myresult:
        print(i[1])
    print("xuong dong")

    