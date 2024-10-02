interface TodoType {
    id: number;
    value: string;
    completed: boolean;
}

const saveStorage = (key: string, data: any): void => {
    window.localStorage.setItem(key, JSON.stringify(data));
}

const getDataStorage = (key: string): any => {
    const data = window.localStorage.getItem(key);
    if (data != null) {
        return JSON.parse(data);
    }
    return null;
}

let elForm: Element | null = document.querySelector('.todo-form');
let elList: Element | null = document.querySelector('.todo-list');
let elInput: Element | null = document.querySelector('.todo-input');
let filterButtons: NodeListOf<Element> | null = document.querySelectorAll('.filter-btn');

const todoList: TodoType[] = getDataStorage('todo') || [];
let isEditing: boolean = false;
let currentId: number | null = null;

elForm?.addEventListener('submit', (e) => {
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
        } else {
            const newObj: TodoType = {
                id: todoList.length ? Number(todoList[todoList.length - 1].id + 1) : 1,
                value: inputValue,
                completed: false
            }
            todoList.push(newObj);
        }
    }
    if (e.target && e.target instanceof HTMLFormElement) {
        e.target.reset();
    }
    renderTodoList(todoList);
    saveStorage('todo', todoList);
});

function renderTodoList(arr: TodoType[]) {
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
        elList?.appendChild(elItem);
    });

    document.querySelectorAll('.complete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = (e.target as HTMLElement).getAttribute('data-id');
            toggleComplete(Number(id));
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = (e.target as HTMLElement).getAttribute('data-id');
            deleteTodoItem(Number(id));
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = (e.target as HTMLElement).getAttribute('data-id');
            editTodoItem(Number(id));
        });
    });
}

const date = new Date();
const formattedDate = date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour:'numeric' });
console.log(formattedDate);

function toggleComplete(id: number) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList[index].completed = !todoList[index].completed;
        saveStorage('todo', todoList);
        renderTodoList(todoList);
    }
}

function deleteTodoItem(id: number) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1) {
        todoList.splice(index, 1);
        saveStorage('todo', todoList);
        renderTodoList(todoList);
    }
}

function editTodoItem(id: number) {
    const index = todoList.findIndex(item => item.id === id);
    if (index !== -1 && elInput && elInput instanceof HTMLInputElement) {
        elInput.value = todoList[index].value;
        isEditing = true;
        currentId = id;
    }
}

filterButtons?.forEach(button => {
    button.addEventListener('click', (e) => {
        const filter = (e.target as HTMLElement).getAttribute('data-filter');
        if (filter === 'all') {
            renderTodoList(todoList);
        } else if (filter === 'completed') {
            renderTodoList(todoList.filter(item => item.completed));
        } else if (filter === 'uncompleted') {
            renderTodoList(todoList.filter(item => !item.completed));
        }
    });
});

renderTodoList(todoList);