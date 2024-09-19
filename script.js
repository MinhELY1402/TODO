const inputBox = document.getElementById("todo-app__row--input-box");
const list = document.getElementById("todo-app__list");
let draggedItem = null;  // Biến lưu trữ mục đang kéo

// Hàm thêm task
function addTask(){
    if(inputBox.value === ''){
        alert("Nhập task cần làm đê!!");
    }
    else{
        let li = document.createElement("li");
        li.className = "todo-app__list--item";
        li.setAttribute("draggable", "true");
        li.innerHTML = inputBox.value;
        list.appendChild(li);
        // Thêm thời gian tạo task
        let timeSpan = document.createElement("span");
        timeSpan.className = "todo-app__time";
        let now = new Date();
        timeSpan.innerHTML = ` (Tạo lúc: ${now.toLocaleTimeString()})`;
        li.appendChild(timeSpan);
        // Thêm span để xóa
        let span = document.createElement("span");
        span.innerHTML = "X";
        li.appendChild(span);
        // Kích hoạt lại chức năng kéo và thả
        addDragAndDropEvents(li);
        saveData();
    }
    inputBox.value = "";
}
// Thêm sự kiện khi click vào danh sách (để xóa hoặc đánh dấu hoàn thành)
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
// Hàm lưu dữ liệu vào localStorage
function saveData(){
    localStorage.setItem("data", list.innerHTML);
}
// Hiển thị các task đã lưu từ localStorage
function showTask(){
    list.innerHTML=localStorage.getItem("data");
    list.querySelectorAll("li").forEach(addDragAndDropEvents);  // Thêm sự kiện drag cho mỗi mục
}
showTask();
// Thêm sự kiện kéo và thả
function addDragAndDropEvents(item) {
    item.addEventListener('dragstart', function () {
        draggedItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', function () {
        setTimeout(() => {
            draggedItem = null;
            item.classList.remove('dragging');
        }, 0);
    });

    list.addEventListener('dragover', function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });
}

// Hàm tính toán vị trí sau khi kéo
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-app__list--item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}