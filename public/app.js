const taskList = document.getElementById('taskList');

const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

let allTasks = [];

taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        alert('Введите название задачи');
        return;
    }

    await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
    });

    titleInput.value = '';
    descriptionInput.value = '';

    loadTasks();
});

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');

        if (!response.ok) {
            throw new Error('Ошибка загрузки задач');
        }

        const tasks = await response.json();

        allTasks = tasks;
        renderTasks(allTasks);

    } catch (error) {
        console.error(error);

        taskList.innerHTML = `
            <p>Не удалось загрузить задачи.</p>
        `;
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <p>Список задач пуст.</p>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskCard = document.createElement('div');

        taskCard.classList.add('task-card');

        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || 'Описание отсутствует'}</p>
            <p>Статус: ${task.status}</p>

            <button onclick="toggleTaskStatus(${task.id}, '${task.status}')">
                ${task.status === 'completed' ? 'Сделать активной' : 'Отметить выполненной'}
            </button>

            <button onclick="deleteTask(${task.id})">
                Удалить
            </button>
        `;

        taskList.appendChild(taskCard);
    });
}

async function toggleTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'active' : 'completed';

    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    });

    loadTasks();
}

async function deleteTask(id) {
    const isConfirmed = confirm('Удалить задачу?');

    if (!isConfirmed) {
        return;
    }

    await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
    });

    loadTasks();
}

function filterTasks() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredTasks = allTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchText);
        const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    renderTasks(filteredTasks);
}

searchInput.addEventListener('input', filterTasks);
statusFilter.addEventListener('change', filterTasks);

loadTasks();
