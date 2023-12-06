const tenNhan = document.querySelector("#ten-nhan")
const imgMau2 = document.querySelector("#imgMau2")
const submit = document.querySelector("input[type=submit]")
const text = document.querySelector("input[type=text]")
const addMau = document.querySelector("#addMau")
let xem  
let suaMau
let xoaMau
let checkImg = 0


tenNhan.innerHTML = localStorage.getItem("ten-nhan")


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


submit.addEventListener('click' , async function(e){
    const sendData = {
        id:localStorage.getItem("id"),
        ten:text.value
    }
    addMau.innerHTML = ''
    console.log(sendData)
    const url = `http://localhost:8080/quanlymau/get-img/${sendData.id}/${sendData.ten}`
    const data = await postData(url, 'GET')
    console.log(data)
    data.forEach((element, index) => {
        let tr = document.createElement('tr')
        tr.innerHTML = `<th scope="row">${index + 1}</th>
        <td>${element.pathMau2}</td>
        <td>${element.ngayThem}</td>

        <td>
            <button class='sua-mau2' value="${element.idMau2}">Sửa</button>
            <button class='xoa-mau2' value="${element.idMau2}">Xóa</button>
        </td>
        <td><button class='xem' value="${element.idMau2}" >Xem chi tiết</button></td>
        `
        addMau.appendChild(tr)
    });
    xem = document.querySelectorAll('.xem')
    suaMau = document.querySelectorAll(".sua-mau2")
    xoaMau = document.querySelectorAll(".xoa-mau2")
    checkImg = 0

    xemAnh(data)

    suaAnh(data)
    xoaAnh(data)

})


function xemAnh(data){
    xem.forEach((element, index) =>{
        element.addEventListener('click' , function(){
            checkImg = index
            const img = "data:image/jpg;base64," + data[index].imgMau2
            imgMau2.src = img
        })
    })
}


function suaAnh(data){
    
    suaMau.forEach((element , index) =>{
        element.addEventListener('click' , function(){
         
            localStorage.setItem('choseImg' , 
            JSON.stringify({
                a :data[index]
            }))
            
            window.location.href = "Sua_Mau_FaceRecogniton.html"
        })
    })
}

function xoaAnh(data){
    xoaMau.forEach(async (element , index) =>{
        element.addEventListener("click" ,async (e) =>{
            document.querySelectorAll('tr')[index + 1].style.display = "none"; 
            if (checkImg  == index){
                imgMau2.src = ''
            }
            console.log(`http://localhost:8080/quanlymau/delete-${data[index].pathMau2}/${data[index].idMau2}`)
            const get = await postData(`http://localhost:8080/quanlymau/delete-${data[index].pathMau2}/${data[index].idMau2}`,
            "GET")
        })
       
    })
}