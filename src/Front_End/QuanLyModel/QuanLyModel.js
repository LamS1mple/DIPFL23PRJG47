
const render = document.querySelector("#addModel")
let chon
const reTrain = document.querySelector("#reTrain")
async function getData(url){
    const respon = await fetch(url)
    return respon.json()
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

let isTrain
ren()
async function ren (){
    const data = await getData("http://localhost:8080/model2")
    data.aList.forEach((element, index) => {
        let tr = document.createElement('tr')
        tr.classList.add("hang")
        tr.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${element.path}</td>
        <td>${element.date}</td>
        <td>${element.acc}</td>
        <td>${element.pre}</td>
        <td>${element.rec}</td>
        <td>${element.f1_s}</td>
        <td><button class='xoa' value=${element.id}>Xóa</button></td>
        <input type="text" name="" class="idModel" value=${element.id} hidden >

        `
        if (element.train){
            tr.innerHTML += `<td><button class='chon isTrain'>Chọn</button></td>`
            isTrain = index
        }
        else{
            tr.innerHTML += `<td><button class='chon'>Chọn</button></td>`
        }
        render.appendChild(tr)
    });

    idModel = document.querySelectorAll(".idModel")
    chon = document.querySelectorAll(".chon")
    chon.forEach((element , index)=>{
        element.addEventListener('click', function(e){
            chon[isTrain].classList.remove('isTrain')
            e.target.classList.add('isTrain')
            if (isTrain != index){
                
                getData(`http://localhost:8080/model2/${idModel[isTrain].value}/${idModel[index].value}`)
            }
            isTrain = index;
        })
    })

    
   

    document.querySelectorAll(".xoa").forEach((element, index )=>{
        element.addEventListener('click', function(){
            if (isTrain != index){
                document.querySelectorAll(".hang")[index].style.display = 'none'
                getData(`http://localhost:8080/model2/delete${data.aList[index].path}`)
            }
        })
    })
}

localStorage.setItem("trangThai", 0);