//******************************************************VARIABLES*************************************************************************

var taskLists = [];
let currentIndex; 
const tasks = document.querySelector('.tasks');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const openModalDiv = document.querySelector('.open-modal-div');
const closeModalBtn = document.querySelector('.close')
const taskName = document.getElementById('input-task');
const addTaskBtn= document.getElementById('add-task');
const deleteBtn = document.querySelector('.delete-task');
const updateTaskBtn = document.getElementById("update-task");

//******************************************************FUNCTIONS*************************************************************************
const toggleDisplay = (taskType) => {
    if (taskType === 'add') {
        updateTaskBtn.style.display = 'none';
        addTaskBtn.style.display = 'block';
        taskName.value = '';
    } else if (taskType === 'update') {
        addTaskBtn.style.display = "none";
        updateTaskBtn.style.display = "block";
    }
}

const openModal = (taskType) => {
    toggleDisplay(taskType);
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    taskName.focus();
}

const closeModal = (e) => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

const findIndex = (taskId) => {
    let targetIndex = -1;
    for (i = 0 ; i < taskLists.length ; i ++) {
        if (taskLists[i].id == taskId) {
            targetIndex = i;
        }
    }
    return targetIndex;
}

const validateInput = () => {
    let text = taskName.value;
    event.preventDefault();
    
    if (text !== '') {
        taskName.value = '';
        addTask(text);
        closeModal();
    } else {
        alert('Field cannot be empty!');
    }
}

const addTask = (taskName, taskDescription, taskDate, taskCategory) => {
    const task = { name: taskName, isComplete: false, deleted: false, id: Date.now() };
    taskLists.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskLists));
    displayTask(task);
}

const displayTask = (task) => {
    localStorage.setItem('tasks', JSON.stringify(taskLists));
    const list = document.querySelector('.tasks');
    const item = document.querySelector(`[id='${task.id}']`);

    if (task.deleted) {
        item.remove();
        return;
    }

    const isComplete = task.isComplete ? 'done': '';
    const newTodoItem = document.createElement('li');
    newTodoItem.setAttribute('class', `task ${isComplete}`);
    newTodoItem.setAttribute('id', task.id);
    
    newTodoItem.innerHTML = `
        <label class='label-text' id='${task.id}'>${task.name}</label>
        <span class='buttons' id='${task.id}'>
            <span class='edit-btn'>&#9998;</span>
            <input type='button' value = '✓'name='${task.id}' id='${task.id}' class='mark-as-complete'>
            <input type='button' value='x' name='${task.id}' id='${task.id}' class='delete-task'>
        </span>
    `;

    if (list.contains(item)) {
        list.replaceChild(newTodoItem, item);
    } else {
        list.appendChild(newTodoItem);
    }
}

const markAsComplete = (taskId) => {
    const index = findIndex(taskId);
    taskLists[index].isComplete = !taskLists[index].isComplete;
    displayTask(taskLists[index]);
}

const deleteTask = (taskId) => {
    const index = findIndex(taskId);
    if(index > -1 && index < taskLists.length) {
        taskLists[index].deleted = !taskLists[index.deleted];
        displayTask(taskLists[index]);
        taskLists.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(taskLists));
    } else {
        alert("invalid index specified")
    }
}

const editTask = () => {
    const itemIndex = currentIndex;
    const updatedText = taskName.value;
    taskLists[itemIndex].name = updatedText;
    localStorage.setItem('tasks', JSON.stringify(taskLists));
    displayTask(taskLists[itemIndex]);
}

const handleClick = (event) => {
    if (event.target.classList.contains('overlay')) {
        closeModal();
    } if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    } else if (event.key == 'Enter') {
        validateInput();
    }
}

const fetchFromLocalStorage = () => {
    const localStorageData = localStorage.getItem('tasks');
    if (localStorageData) {
        taskLists = JSON.parse(localStorageData);
        taskLists.forEach (task => {
            displayTask(task);
        })
    }
}

//******************************************************EVENT LISTENERS*******************************************************************
openModalDiv.addEventListener('click', () => {
    openModal('add');
});
closeModalBtn.addEventListener('click', closeModal);
addTaskBtn.addEventListener('click', validateInput);
updateTaskBtn.addEventListener('click', editTask);
tasks.addEventListener('click', function(e) {
    const itemKey = e.target.parentElement.id;
    if (e.target.classList.contains('mark-as-complete')) {
        markAsComplete(itemKey);
    } else if (e.target.classList.contains('delete-task')) {
        deleteTask(itemKey);
    } else if (e.target.classList.contains('edit-btn')) {
        const itemIndex = findIndex(itemKey);
        currentIndex = itemIndex;
        taskName.value = taskLists[itemIndex].name;
        openModal('update');
        openModal();
        editTask();
    }
});
document.addEventListener('keydown', handleClick);
window.addEventListener('click', handleClick);
document.addEventListener('DOMContentLoaded', fetchFromLocalStorage);
