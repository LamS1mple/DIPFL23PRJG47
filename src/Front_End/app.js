
const videoElement = document.querySelector("#localVideo");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    videoElement.srcObject = stream;

    setInterval(captureAndSendFrame, 1000); // Cứ sau 100ms cắt và gửi frame
  })
  .catch((error) => {
    console.error("Không thể truy cập webcam: " + error);
  });
var nameOld = "unknown";
async function captureAndSendFrame() {
  // Đặt kích thước canvas để phù hợp với video
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  // Vẽ frame hiện tại từ video lên canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Trích xuất dữ liệu hình ảnh từ canvas dưới dạng base64
  const frameDataUrl = canvas.toDataURL("image/jpg");


  const data = await fetch("http://localhost:8080/thu", {
    method: "POST",
    body: JSON.stringify({ name: frameDataUrl }),
  });
  
//   console.log(await data.json())
  let a = await data.json()
  let jsonContent = JSON.parse(a.content)
  if (nameOld != jsonContent.ten_doi_tuong && jsonContent.ten_doi_tuong != "unknown"){
    setTimeout(()=>{
      alert(jsonContent.ten_doi_tuong + " đã điểm danh thành công");
    },3000)
  }
  nameOld = jsonContent.ten_doi_tuong;
 
  document.querySelector("#xuly").src = "data:image/jpeg;base64," +  jsonContent.name;
}
