const inputBox = document.getElementById("todo-app__row--input-box");
const typeBox = document.getElementById("todo-app__row--type-box");  // Trường loại công việc
const list = document.getElementById("todo-app__list");
let draggedItem = null;  // Biến lưu trữ mục đang kéo

// Hàm thêm task
function addTask(){
    if(inputBox.value === '' || typeBox.value === ''){
        alert("Nhập task cần làm và loại task đê!!");
    }
    else{
        let li = document.createElement("li");
        li.className = "todo-app__list--item";
        li.setAttribute("draggable", "true");
        // Thêm tên task
        let taskName = document.createElement("div");
        taskName.innerHTML = inputBox.value;
        taskName.classList.add("todo-app__task-name");
        li.appendChild(taskName);
        // Thêm loại công việc
        let taskType = document.createElement("span");
        taskType.innerHTML = ` [${typeBox.value}]`;
        taskType.classList.add("todo-app__task-type");
        li.appendChild(taskType);
        // Thêm thời gian tạo task
        let timeSpan = document.createElement("span");
        timeSpan.className = "todo-app__time";
        let now = new Date();
        timeSpan.innerHTML = ` (Tạo lúc: ${now.toLocaleTimeString()})`;
        li.appendChild(timeSpan);
        // Thêm span để xóa
        let span = document.createElement("span");
        span.innerHTML = "X";
        span.classList.add("delete-btn");
        li.appendChild(span);
        // Kích hoạt lại chức năng kéo và thả
        list.appendChild(li);
        addDragAndDropEvents(li);
        saveData();
    }
    inputBox.value = "";
    typeBox.value = "";  // Xóa trường nhập loại công việc sau khi thêm
}
// Thêm sự kiện khi click vào danh sách (để xóa hoặc đánh dấu hoàn thành)
list.addEventListener("click", function (e) {
    if (e.target.tagName === "LI" || e.target.classList.contains("todo-app__task-name")) {
        e.target.classList.toggle("todo-app__list--check");
        saveData();
    } else if (e.target.tagName === "SPAN" && e.target.classList.contains("delete-btn")) {
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

// Lọc công việc theo trạng thái
function filterTasks(status) {
    const tasks = list.querySelectorAll("li");
    tasks.forEach(task => {
        switch (status) {
            case 'all':
                task.style.display = "block";
                break;
            case 'completed':
                if (task.classList.contains("todo-app__list--check")) {
                    task.style.display = "block";
                } else {
                    task.style.display = "none";
                }
                break;
            case 'incomplete':
                if (!task.classList.contains("todo-app__list--check")) {
                    task.style.display = "block";
                } else {
                    task.style.display = "none";
                }
                break;
        }
    });
}
