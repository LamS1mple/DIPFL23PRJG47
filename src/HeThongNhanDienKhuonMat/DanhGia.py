import pandas as pd

def tinhCongThuc():
    try:
        C = 0
        data = pd.read_excel('appending_values.xlsx') 
        df_ThucTe = data['Thuc te'].tolist()
        df_DuDoan = data['Du doan'].tolist()

        # nhan = df_ThucTe.
        l = len(df_ThucTe)
        pre = 0
        rec = 0
        s = set(df_ThucTe + df_DuDoan)
        s = list(s)
        print(l , s)
        for i in range(len(s)):
            TP = 0 
            FP = 0 
            TN = 0
            FN = 0
            for j in range(l):
                p = 0
                if df_ThucTe[j] == s[i]:
                    
                    if df_DuDoan[j] != s[i]:
                        FN += 1
                    else:
                        TP += 1
                else:
                    if df_DuDoan[j] != s[i]:
                        TN += 1
                    else:
                        FP += 1
            soLuong = df_ThucTe.count(s[i])
            pre += (TP * soLuong) /(TP + FP) *100
            rec += (TP * soLuong) /(TP + FN) *100
            # print(p)
            C +=  (TP + TN) / l
        acc = C /len(s) * 100
        pre /= l
        rec /= l
        fr = (2*pre * rec) / (rec + pre)
        print(f'acc {acc}')
        print(f'pre {pre}')
        print(f'rec {rec}')
        print(f'fr {fr}')
        return acc, pre, rec , fr
    except:
        return 0 , 0 , 0 ,0
# a , b , c , d = tinhCongThuc()

# print(a , b , c, d)
