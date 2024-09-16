const inputBox = document.getElementById("todo-app__row--input-box");
const list = document.getElementById("todo-app__list");

function addTask(){
    if(inputBox.value === ''){
        alert("Nhập task cần làm đê!!");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        list.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "X";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

list.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("todo-app__list--check");
        saveData();
    }   
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData(){
    localStorage.setItem("data", list.innerHTML);
}

function showTask(){
    list.innerHTML=localStorage.getItem("data");
}

showTask();