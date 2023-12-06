const input_text = document.querySelector("input[type=text]");
const button_search = document.querySelector("input[type=submit]");
const getAllNhanByName = document.getElementById("addNhan");
const reTrain = document.getElementById("reTrain")
let detail;
const titleRe = document.querySelector("#tt")

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
  const text = input_text.value + "";
  input_text.value = "";
  if (text != undefined || text !== "") {
    const data = await postData(
      "http://localhost:8080/quanlymau/" + text,
      "GET"
    );
    // console.log(data)
    getAllNhanByName.innerHTML = "";

    data.forEach((element, index) => {
      const id = element.id;
      let add = document.createElement("tr");
      add.innerHTML = `
            <th scope="row">${index + 1}</th>
                    <td>${element.nhan}</td>
            
        `;

      if (mang.includes(id)) {
        add.innerHTML += `<td><input type="checkbox" class='detail isTrain' checked=true value="${id}" nhan='${element.nhan}'/></td>`;
      } else {
        add.innerHTML += `<td><input type="checkbox" class='detail' value="${id}" nhan='${element.nhan}'/></td>`;
      }
      console.log(add);
      getAllNhanByName.appendChild(add);
    });
  }
  detail = document.querySelectorAll(".detail");
  XemChiTiet();
});
let mang = [];

function XemChiTiet() {
  detail.forEach((element, index) => {
    element.addEventListener("click", function (e) {
      const value = Number(e.target.getAttribute("value"))
      if (e.target.classList.contains("isTrain")) {

        mang = mang.filter(function (item) {
          return item !== value;
        });

        e.target.classList.remove("isTrain")

      }
      else{
        e.target.classList.add("isTrain")
        mang.push(value)
      }
    });
  });
}
async function goi(){
  let data =await postData("http://localhost:8080/CheckTrain", "GET")
  if(data){
    titleRe.innerHTML = 'Đã train xong'
    reTrain.classList.remove("bambam")
    localStorage.setItem("trangThai", 2)

  }

  setTimeout(goi , 2000);
}

reTrain.addEventListener('click', function(e){
    let data = new FormData()
    data.append("idNhan", mang)
    fetch("http://localhost:8080/model2/retrain", {
      method:"POST",
      body: data
    })
    localStorage.setItem("trangThai", 1)

    reTrain.classList.add("bambam")
    titleRe.innerHTML = 'Đang retrain vui lòng đợi'
    setTimeout(goi, 2000);
    // window.location.href = "QuanLyModel.html"
})

document.querySelector("#chonall").addEventListener('click' , function(e){
  detail.forEach((value) =>{
    if (!value.classList.contains("isTrain")) {
      value.classList.add("isTrain")
      mang.push(value.getAttribute("value"))
      value.checked = true
    }
  })
})
document.querySelector("#xoaall").addEventListener('click' , function(e){
  detail.forEach((value) =>{
    if (value.classList.contains("isTrain")) {
      ppp = value.getAttribute("value")
      mang = mang.filter(function (item) {
        return item !== ppp;
      });

      value.classList.remove("isTrain")
      value.checked = false
    }
  })
})

function CalBack(){
  let data = localStorage.getItem("trangThai")
  if (data == 1){
    reTrain.classList.add("bambam")
    titleRe.innerHTML = 'Đang retrain vui lòng đợi'  
  }
  if (data == 2){
    reTrain.classList.remove("bambam")
    titleRe.innerHTML = 'Đã train xong'
  }
  setTimeout(CalBack, 2000);
}
CalBack()