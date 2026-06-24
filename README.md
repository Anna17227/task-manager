# Task Manager

Task Manager — веб-приложение для управления личными задачами. В нём можно создавать задачи с описанием, просматривать список, менять статус выполнения, удалять задачи, искать их по названию и фильтровать по статусу. Клиентская часть взаимодействует с сервером через REST API, а данные хранятся в PostgreSQL.

## Стек

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **База данных:** PostgreSQL

## Возможности

- создание задачи с названием и описанием;
- просмотр списка задач;
- изменение статуса задачи;
- удаление задачи;
- поиск задач по названию;
- фильтрация задач по статусу.

## Локальный запуск

1. Склонируйте репозиторий и перейдите в его папку:

   ```bash
   git clone https://github.com/Anna17227/task-manager.git
   cd task-manager
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Создайте базу данных PostgreSQL и примените схему из файла `schema.sql`:

   ```bash
   psql -U postgres -d task_manager -f schema.sql
   ```

4. В корне проекта создайте файл `.env` и задайте параметры подключения:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task_manager
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. Запустите приложение:

   ```bash
   npm start
   ```

После запуска откройте [http://localhost:3000](http://localhost:3000).

## REST API

| Метод | Эндпойнт | Назначение |
| --- | --- | --- |
| `GET` | `/api/tasks` | Получить все задачи |
| `POST` | `/api/tasks` | Создать задачу |
| `PUT` | `/api/tasks/:id` | Изменить статус задачи |
| `DELETE` | `/api/tasks/:id` | Удалить задачу |

Пример тела запроса для создания задачи:

```json
{
  "title": "Подготовить отчёт",
  "description": "Добавить ERD, Use Case и демонстрацию"
}
```