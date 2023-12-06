import datetime
import cv2 
import numpy as np
import mtcnn
from architecture import *
# from train_v2 import normalize,l2_normalizer
from scipy.spatial.distance import cosine
from tensorflow.keras.models import load_model
import os
import pickle
import time
import openpyxl
from sklearn.preprocessing import Normalizer


import requests
import json
import base64
from PIL import Image
from io import BytesIO
import mysql.connector

import DanhGia

url = 'http://localhost:8080/xuly'

mydb = mysql.connector.connect(
        host       ="127.0.0.1",
        user="root",
        password="Lam2002",
        database="httt"
)
mycursor = mydb.cursor()

def model (mang,  face_detector , encode2 ):
    x1 = datetime.datetime.now()

    nameFile = "{}_{}_{}_{}_{}_{}".format(x1.day,x1.month , x1.year , x1.hour, x1.minute,x1.second)
    sql = "insert into model2 (path, dateTrain, Acc, Pre, Rec, F1_s, isTrain) values(%s , %s,%s,%s,%s,%s ,%s)"
    

    face_data = 'train/'
    required_shape = (160,160)
    face_encoder = InceptionResNetV2()
    path = "facenet_keras_weights.h5"
    face_encoder.load_weights(path)
    # face_detector = mtcnn.MTCNN()
    encodes = []
    encoding_dict = dict()
    l2_normalizer = Normalizer('l2')


    def normalize(img):
        mean, std = img.mean(), img.std()
        return (img - mean) / std

    count = 0
    for id in mang:

        mycursor.execute("SELECT * FROM mau2, nhan where nhanId=idNhan and nhanId = {}".format(id))
        myresult = mycursor.fetchall()

        for x in myresult:
            anhNguon = r'D:\IMG_HTTM\Re\\' + x[1]
        
            ten = x[6]
            try:

                img_BGR = cv2.imread(anhNguon)
                img_RGB = cv2.cvtColor(img_BGR, cv2.COLOR_BGR2RGB)

                x = face_detector.detect_faces(img_RGB)
                x11, y1, width, height = x[0]['box']
                x11, y1 = abs(x11) , abs(y1)
                x2, y2 = x11+width , y1+height
                face = img_RGB[y1:y2 , x11:x2]
                        
                face = normalize(img_RGB)
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
                    print(ten)
                    encoding_dict[ten] = encode
        
    path = 'encodings/encodings{}.pkl'.format(nameFile)
    with open(path, 'wb') as file:
        pickle.dump(encoding_dict, file)
    encoding_dict = load_pickle(path)
    print("Ghi excel")
    excel(face_detector ,encode2 , encoding_dict)

    Acc, Pre , Rec, F1_s = DanhGia.tinhCongThuc()
    print(Acc, Pre , Rec, F1_s )
    val = ('encodings{}.pkl'.format(nameFile) , x1, Acc, Pre, Rec, F1_s, 0)
    print(val)

    mycursor.execute(sql, val)
    mydb.commit()
    requests.get("http://localhost:8080/CheckTrainPy")
    









confidence_t=0.99
recognition_t=0.4
required_size = (160,160)


l2_normalizer = Normalizer('l2')

def normalize(img):
    mean, std = img.mean(), img.std()
    return (img - mean) / std

def get_face(img, box):
    x1, y1, width, height = box
    x1, y1 = abs(x1), abs(y1)
    x2, y2 = x1 + width, y1 + height
    face = img[y1:y2, x1:x2]
    return face, (x1, y1), (x2, y2)

def get_encode(face_encoder, face, size):
    face = normalize(face)
    face = cv2.resize(face, size)
    encode = face_encoder.predict(np.expand_dims(face, axis=0))[0]
    return encode


def load_pickle(path):
    with open(path, 'rb') as f:
        encoding_dict = pickle.load(f)
    return encoding_dict

def detect(img ,detector,encoder,encoding_dict):
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = detector.detect_faces(img_rgb)
    for res in results:
        if res['confidence'] < confidence_t:
            continue
        face, pt_1, pt_2 = get_face(img_rgb, res['box'])
        encode = get_encode(encoder, face, required_size)
        encode = l2_normalizer.transform(encode.reshape(1, -1))[0]
        global name
        name = 'unknown'

        distance = float("inf")
        for db_name, db_encode in encoding_dict.items():
            dist = cosine(db_encode, encode)
            if dist < recognition_t and dist < distance:
                name = db_name
                distance = dist

        if name == 'unknown':
            cv2.rectangle(img, pt_1, pt_2, (0, 0, 255), 2)
            cv2.putText(img, name, pt_1, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 1)
        else:
            cv2.rectangle(img, pt_1, pt_2, (0, 255, 0), 2)
            cv2.putText(img,  '{}__{:.2f}'.format(name, distance), (pt_1[0], pt_1[1] - 5), cv2.FONT_HERSHEY_SIMPLEX, 1,
                        (0, 200, 200), 2)
            
    return img


def excel(face_detector , face_encoder , encoding_dict):
    wb = openpyxl.Workbook()
    data = [
        ('STT', 'Mau' , 'Thuc te', 'Du doan')
    ]
    sheet = wb.active

    face_test = "test/"
    dem = 1
    for face_names in os.listdir(face_test):
                person_dir = os.path.join(face_test,face_names)

                for image_name in os.listdir(person_dir):
                        img = cv2.imread(person_dir + "/"+image_name)
                        detect(img,face_detector , face_encoder , encoding_dict )
                        data.append( (dem , person_dir + "/"+image_name, face_names, name) )
                        dem += 1
    for i in data:  
        sheet.append(i)  
    wb.save('appending_values.xlsx')  

reTrain = False
isTrain = True
mang = []
if __name__ == "__main__":
    required_shape = (160,160)
    
    face_encoder = InceptionResNetV2()
    path_m = "facenet_keras_weights.h5"
    face_encoder.load_weights(path_m)
    face_detector = mtcnn.MTCNN()
    
    while True:
        
        if (reTrain):
            print("Chay Is Train")
            print(mang)
            model(mang , face_detector, face_encoder )
        if (isTrain):
            mydb = mysql.connector.connect(
                    host       ="127.0.0.1",
                    user="root",
                    password="Lam2002",
                    database="httt"
            )
            mycursor = mydb.cursor()
            print("Chay Is Train")
            mycursor.execute("SELECT * FROM model2 where isTrain = 1")
            myresult = mycursor.fetchall()
            nameTrain = myresult[0][1]
            global encodings_path
            encodings_path = 'encodings/{}'.format(nameTrain)
            print(encodings_path)
        
        print(encodings_path)
        encoding_dict = load_pickle(encodings_path)
        

        face_test = "test/"
        count = 0
        # for face_names in os.listdir(face_test):
        #     person_dir = os.path.join(face_test,face_names)

        #     for image_name in os.listdir(person_dir):
        while True:
            reTrain = False
            isTrain = False
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                
                decoded_data = base64.b64decode(data['content'])
                    
                np_data = np.fromstring(decoded_data,np.uint8)
                img = cv2.imdecode(np_data,cv2.IMREAD_UNCHANGED)
                
                if (data['reTrain'] ):
                    print("OUT")
                    
                    mang = data['arr']
                    
                    reTrain = True
                    break
                if (data['isTrain'] ):
                    isTrain = True
                    break
                frame= detect(img , face_detector , face_encoder , encoding_dict)
                _, encoded_image = cv2.imencode('.png', frame)
                base64_image = base64.b64encode(encoded_image.tobytes()).decode('utf-8')
                data = {
                "name" : base64_image,
                "ten_doi_tuong": name
                }
                response2 = requests.post(url, json=data)
                


            else:
                print(f'Error: {response.status_code} - {response.text}')
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        


