Các bước để thực hiện chương trình.
B1: Cài đặt các ide, tool: Eclipse, Visual studio, mysql, anaconda
B2: Tại visual studio cài tool extensions live server
B3: Tại mysql, tạo database có tên là httm và import script_mysql.sql vào mysql và tại bảng nhan hãy nhập tên vào cột ten để phục vụ cho
quá trình thêm mẫu. Import các file *.csv vào đúng bảng đã ghi trong tên bảng ở tên file)

B4: Copy folder IMG_HTTM(dataset) sang ổ D

B5: Tại ide eclipse cài framework springboot

B6: Open thư mục HeThongThongMinh bằng Eclipse
B7: Open thư mục HeThongNhanDienKhuonMat bằng visual studio
B8: Open thư mục Front_End bằng visual studio

B9: Tại visual studio mở HeThongNhanDienKhuonMat cài đặt các thư viện

B10: Tại anaconda cài đặt các thư viện
- pip install opencv-python
- pip install virtualenv
- python -m pip install --user numpy scipy matplotlib ipython jupyter pandas sympy nose
- pip install requests
- pip install openpyxl

B11: Khởi chạy eclipse chạy chương trình HeThongThongMinh

B12: Khởi chạy file index.html trong Front_End
B13: Sau đó mới chạy file detect.py trong HeThongNhanDienKhuonMat
B14: Để vào giao diện thêm mẫu và train model. Tại visual bật Front_End. 
Tại file home.html bật file bằng live server(Từng bước, giao diện thêm mẫu và train model đã có trong báo cáo phần giao diện)

(Lưu ý 1: thay đổi tất cả các password của mysql ở file detect.py và trong HeThongThongMinh ở file application.properties bằng chính password ở máy local)
(Lưu ý 2: Để model đánh giá được chính xác nhất thì khi train đối tượng nào thì trong forder test của HeThongNhanDienKhuonMat sẽ tạo forder có tên
của đối tượng đó và chứa ảnh của đối tượng đó thể thực hiện quá trình đánh giá model)

