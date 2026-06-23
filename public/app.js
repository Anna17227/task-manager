const taskList = document.getElementById('taskList');

const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');

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

        renderTasks(tasks);

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
        `;

        taskList.appendChild(taskCard);
    });
}

loadTasks();