const input_text = document.querySelector("input[type=text]");
const button_search = document.querySelector("input[type=submit]");
const getAllNhanByName = document.getElementById("addNhan");
let detail ;

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

button_search.addEventListener("click", async function (event) {
  const text = input_text.value +'';
  input_text.value = ''
  if (text != undefined  || text !== '') {
    const data = await postData(
      "http://localhost:8080/quanlymau/" + text,"GET");
    // console.log(data)
    getAllNhanByName.innerHTML = "";
    
    data.forEach((element , index) => {
      const id = element.id
      let add = document.createElement("tr");
      add.innerHTML = `
            <th scope="row">${index + 1}</th>
                    <td>${element.nhan}</td>
                    
                    <td>
                        <button value="${id}">Sửa</button>
                        <button value="${id}">Xóa</button>
                    </td>
            <td><button class='detail' value="${id}" nhan='${element.nhan}'>Xem chi tiết</button></td>
        `;
      console.log(add);
      getAllNhanByName.appendChild(add);
    });
  }
  detail = document.querySelectorAll(".detail")
  XemChiTiet()
});



function XemChiTiet(){
  detail.forEach((element, index )=>{
    element.addEventListener('click' , function(e){
      console.log(e)
      localStorage.setItem("id" , element.value)
      localStorage.setItem("ten-nhan" , element.getAttribute('nhan'))
      window.location.href = "/QuanLyMau/Xem_Chi_Tiet_FaceRecogniton.html"
    })
  })
  
}

