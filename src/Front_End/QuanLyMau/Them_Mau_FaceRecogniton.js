const themAnh = document.getElementById("them-anh")
const img = document.getElementById('img')
const file = document.querySelector('input[type=file]')
const enterName = document.querySelector("input[type=text]")

document.querySelector("#nhan").innerHTML ="Nhãn: " +  localStorage.getItem('ten-nhan')

async function postData(url = "", method, data = {}) {
    if (method === "GET") {
      const response = await fetch(url);
      return response.json();
    }
    // Default options are marked with *
    const response = await fetch(url, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}


file.addEventListener('change', function(){
  console.log(file.files[0])
    img.src = URL.createObjectURL(file.files[0])
})


themAnh.addEventListener('click' ,async function(){

  let path = enterName.value+ ".jpg"
  if (path == '.jpg'){
    path =  file.files[0].name
  }
  
  let data = new FormData()
  data.append('img' , file.files[0])
  data.append('id', localStorage.getItem("id"))
  data.append('ten-path', path)
    fetch('http://localhost:8080/quanlymau/post-img', {
      method: 'POST',
      body: data,
    })
    .then(response => {
      if (response.ok) {
        alert("Thành công")
        window.location.href = "/QuanLyMau/Xem_Chi_Tiet_FaceRecogniton.html"
      } else {
        console.error('Loi');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
});
  
 







