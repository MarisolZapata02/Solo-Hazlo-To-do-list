// Selectores
const todoInput = document.querySelector('.todo-input');
const todoBtn = document.querySelector('.todo-btn');
const todoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
todoBtn.addEventListener('click', addToDo);
todoList.addEventListener('click', deleteCheck);
document.addEventListener("DOMContentLoaded", () => {
    getTodos();
    applyTheme(savedTheme);
});
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
let savedTheme = localStorage.getItem('savedTheme') || 'standard';

function addToDo(event) {
    event.preventDefault();

    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert("Debes escribir algo!");
        return;
    }

    const todoDiv = createTodoDiv(todoText);

    todoList.appendChild(todoDiv);
    todoInput.value = '';

    savelocal(todoText);
}

function createTodoDiv(todoText) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add('todo', `${savedTheme}-todo`);

    const newToDo = document.createElement('li');
    newToDo.innerText = todoText;
    newToDo.classList.add('todo-item');
    todoDiv.appendChild(newToDo);

    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.innerText = `|Añadido: ${getCurrentTime()}`;
    todoDiv.appendChild(timestamp);

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    checked.dataset.completed = 'false';
    todoDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    todoDiv.appendChild(deleted);

    return todoDiv;
}

function deleteCheck(event) {
    const item = event.target;

    if (item.classList.contains('delete-btn')) {
        const todoDiv = item.parentElement;
        const todoText = todoDiv.querySelector('.todo-item').innerText;
        todoDiv.classList.add("fall");
        removeLocalTodos(todoText);
        todoDiv.addEventListener('transitionend', function() {
            todoDiv.remove();
        });
    }

    if (item.classList.contains('check-btn')) {
        if (item.dataset.completed === 'false') {
            const todoDiv = item.parentElement;
            todoDiv.classList.toggle("completed");
            const timestamp = todoDiv.querySelector('.timestamp');
            if (!timestamp.innerText.includes('Completed')) {
                timestamp.innerText += ` | Completado: ${getCurrentTime()}`;
            }
            item.dataset.completed = 'true';
            item.disabled = true;
        }
    }
}

function savelocal(todo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.forEach(todo => {
        const todoDiv = createTodoDiv(todo);
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todoContent) {
    const todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const updatedTodos = todos.filter(todo => todo !== todoContent);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    applyTheme(color);
}

function applyTheme(color) {
    document.body.className = color;
    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
              button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}