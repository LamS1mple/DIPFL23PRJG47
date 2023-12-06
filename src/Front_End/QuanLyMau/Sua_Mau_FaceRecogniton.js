
const nhan = document.querySelector('#nhan')
const mau = document.querySelectorAll('.title')
const anh = document.querySelectorAll('.anh')
const upload = document.querySelector("input[type='file']")
const save = document.querySelector("#save")
const getTen = document.querySelector("input[type=text]")

const getData = JSON.parse(localStorage.getItem('choseImg'))

nhan.innerHTML ="Nhãn: " +  localStorage.getItem("ten-nhan")
mau[1].innerHTML ="Mẫu: " + getData.a.pathMau2

const setImg = function(img){getData
    return "data:image/jpg;base64," + img
}
async function postData(url = "", method, data = {}) {
    if (method === "GET") {
      const response = await fetch(url);
      return response.json();
    }
    const response = await fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache", 
      credentials: "same-origin", 
      headers: {
        "Content-Type": "application/json",
        
      },
      redirect: "follow", 
      referrerPolicy: "no-referrer", 
      body: JSON.stringify(data), 
    });
    return response.json(); 
}



anh[0].src =    setImg(getData.a.imgMau2)
upload.addEventListener('change' , function(e){
    console.log(e.target.files[0])
    anh[1].src = URL.createObjectURL(e.target.files[0])
})


save.addEventListener('click', function(){
    let check = true
    let pathMoi = getTen.value + ".jpg";

    if (upload.value !== ""){
        check = false
        
    }
    if (pathMoi == '.jpg'){
        pathMoi = getData.a.pathMau2
    }
    
    if(check){
        let data = {
            pathMoi,
            pathCu :getData.a.pathMau2,
            id: getData.a.idMau2
        }
        console.log(data)
            postData("http://localhost:8080/quanlymau/sua-khong-img","POST",data)
    }
    else{
        let data = new FormData()
        data.append('path-cu' , getData.a.pathMau2);
        data.append("path-moi", pathMoi )
        data.append('img' , upload.files[0])
        data.append('id' , getData.a.idMau2)
        fetch("http://localhost:8080/quanlymau/sua-co-img", {
            method:"post",
            body: data
        }).then(response =>{
            return response.text
        }).then(response =>{
            console.log(response)
        })

    }
    alert("Thành công")
    window.location.href = "Xem_Chi_Tiet_FaceRecogniton.html"
})

