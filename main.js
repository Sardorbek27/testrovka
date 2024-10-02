"use strict";
const saveStorage = (key, data) => {
    window.localStorage.setItem(key, JSON.stringify(data));
};
const getDataStorage = (key) => {
    const data = window.localStorage.getItem(key);
    if (data != null) {
        return JSON.parse(data);
    }
    return null;
};
let elForm = document.querySelector('.todo-form');
let elList = document.querySelector('.todo-list');
let elInput = document.querySelector('.todo-input');
let filterButtons = document.querySelectorAll('.filter-btn');
const todoList = getDataStorage('todo') || [];
let isEditing = false;
let currentId = null;
elForm === null || elForm === void 0 ? void 0 : elForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (elInput && elInput instanceof HTMLInputElement) {
        const inputValue = elInput.value.trim();
        if (inputValue === '') {
            alert('Ustoz xato topolmaysiz :)');
            return;
        }
        if (isEditing && currentId !== null) {
            const index = todoList.findIndex(item => item.id === currentId);
            if (index !== -1) {
                todoList[index].value = inputValue;
                isEditing = false;
                currentId = null;
            }
        }
        else {
            const newObj = {
                id: todoList.length ? Number(todoList[todoList.length - 1].id + 1) : 1,
                value: inputValue,
                completed: false
            };
            todoList.push(newObj);
        }
    }
    if (e.target && e.target instanceof HTMLFormElement) {
        e.target.reset();
    }
    renderTodoList(todoList);
    saveStorage('todo', todoList);
});
function renderTodoList(arr) {
    if (elList) {
        elList.innerHTML = ``;
    }
    arr.forEach(item => {
        const elItem = document.createElement('li');
        elItem.className = `mt-[5px] font-semibold text-[16px] p-1.5 rounded-md ${item.completed ? 'bg-gray-100 opacity-55 line-through' : 'bg-white'}`;
        elItem.innerHTML = `
            <div class="flex items-center justify-between">
            <div>${item.id}. ${item.value} </div>
            <div>
            <button class="complete-btn bg-green-500 text-white p-1 ml-2 rounded-md" data-id="${item.id}">${item.completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="delete-btn bg-red-500 text-white p-1 ml-2 rounded-md" data-id="${item.id}">Delete</button>
            <button class="edit-btn line-through bg-yellow-500 text-white p-1 ml-2 rounded-md" data-id="${item.id}">Edit</button>
            </div>
            </div>
        `;
        elList === null || elList === void 0 ? void 0 : elList.appendChild(elItem);
    });
    document.querySelectorAll('.complete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            toggleComplete(Number(id));
        });
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteTodoItem(Number(id));
        });
    });
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editTodoItem(Number(id));
        });
    });
}
const date = new Date();
const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: 'numeric' });
console.log(formattedDate);
function toggleComplete(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList[index].completed = !todoList[index].completed;
        saveStorage('todo', todoList);
        renderTodoList(todoList);
    }
}
function deleteTodoItem(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList.splice(index, 1);
        saveStorage('todo', todoList);
        renderTodoList(todoList);
    }
}
function editTodoItem(id) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1 && elInput && elInput instanceof HTMLInputElement) {
        elInput.value = todoList[index].value;
        isEditing = true;
        currentId = id;
    }
}
filterButtons === null || filterButtons === void 0 ? void 0 : filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const filter = e.target.getAttribute('data-filter');
        if (filter === 'all') {
            renderTodoList(todoList);
        }
        else if (filter === 'completed') {
            renderTodoList(todoList.filter(item => item.completed));
        }
        else if (filter === 'uncompleted') {
            renderTodoList(todoList.filter(item => !item.completed));
        }
    });
});
renderTodoList(todoList);
