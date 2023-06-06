// Store the task in an array
//dyanamically generate html elements to display each task on the page
//Update the task list based on user action

const taskLists = []; //storing the tasks
// const completedTasks = []; //an array to store completed tasks
// const uncompletedTasks = []; //an array to store uncomleted tasks

const tasks = document.querySelector('.tasks'); //selects the element with the class tasks
const overlay = document.querySelector('.overlay'); //selects the element with a class of overlay
const modal = document.querySelector('.modal'); //selects the element with a class of modal
const openModalDiv = document.querySelector('.open-modal-div'); //opens the modal
const closeModalBtn = document.querySelector('.close')
const taskName = document.getElementById('input-task'); //stores the name of the task
const taskCategory = document.getElementById('input-category'); //stores the category of the task
const addTaskBtn= document.getElementById('add-task'); //adds a new task to the list
const deleteBtn = document.querySelector('.delete-task'); //deletes a task from the list

//removes the class 'hidden' from the modal and overlay
const openModal = function() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

//adds the class 'hidden' to the modal and overlay
const closeModal = function(e) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

const findIndex = function(taskId) {
    let targetIndex = -1;
    for (i = 0 ; i < taskLists.length ; i ++) {
        if (taskLists[i].id == taskId) {
            targetIndex = i;
        }
    }
    return targetIndex;
}

openModalDiv.addEventListener('click', openModal); //opens the modal when clicked
closeModalBtn.addEventListener('click', closeModal); //closes the modal when clicked
addTaskBtn.addEventListener('click', validateInput); //adds the task when clicked
tasks.addEventListener('click', function(e) {
    if (e.target.classList.contains('mark-as-complete')) {
        const itemKey = e.target.parentElement.id;
        console.log(itemKey);
        markAsComplete(itemKey);
        console.log(taskLists);
    } else if (e.target.classList.contains('delete-task')) {
        const itemKey = e.target.parentElement.id;
        console.log(itemKey);
        deleteTask(itemKey);
        console.log(taskLists);
    }
});
document.addEventListener('keydown', handleClick);
window.addEventListener('click', handleClick);

//creates a new todo objects with following properties 'name, category, isComplete, id, date, description' when called parses the taskName and Category property into the task object
function addTask (taskName, taskDescription, taskDate, taskCategory) {
    const task = { name: taskName, category: taskCategory, isComplete: false, deleted: false, id: Date.now() };
    taskLists.push(task);
    displayTask(task);
}

function displayTask(task) {
    const list = document.querySelector('.tasks'); //selects the ul element with class 'tasks'
    const item = document.querySelector(`[id='${task.id}']`);

    if (task.deleted) {
        item.remove();
        return;
    }

    const isComplete = task.isComplete ? 'done': '';
    const newTodoItem = document.createElement('li');  //create a new list item
    newTodoItem.setAttribute('class', `task ${isComplete}`); //give the 'newTodoItem' A class
    newTodoItem.setAttribute('id', task.id); //give the 'newTodoItem' an id
    
    //set the content of the 'newTodoItem' element created above
    newTodoItem.innerHTML = `
        <label class='label-text' id='${task.id}'>${task.name}</label>
        <span class='buttons' id='${task.id}'>
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

function markAsComplete(taskId) {
    const index = findIndex(taskId);
    taskLists[index].isComplete = !taskLists[index].isComplete;
    displayTask(taskLists[index]);
}

function editTask() {

}

function deleteTask(taskId) {
    const index = findIndex(taskId);
    if(index > -1 && index < taskLists.length) {
        taskLists[index].deleted = !taskLists[index.deleted]
        displayTask(taskLists[index]);
        taskLists.splice(index, 1);
    } else {
        alert("invalid index specified")
    }
}

//validate the users input
function validateInput() {
    let text = taskName.value; // Get the value of the task input
    event.preventDefault(); // prevent page refresh on form submission
    
    //checks to see if the text is empty or not
    if (text !== '') {
        addTask(text); //parses 'text, description, date, category' into the add task function
        setToDefault();
        closeModal();
    } else {
        alert('Field cannot be empty!');
    }
}

//reset all the input value back to default, i.e, ' '
function setToDefault() {
    taskName.value = '';
    taskName.focus();
}

function handleClick(event) {
    if (event.target.classList.contains('overlay')) {
        closeModal(); //if anywhere outside the modal is clicked, call the close modal function
    } if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal(); //if the esc button is clicked, call the close modal function
    } else if (event.key == 'Enter') {
        validateInput(); //if enter button is clicked, call the add task method
    }
}