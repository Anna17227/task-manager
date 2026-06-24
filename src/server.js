const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;

const pool = require('./db');

app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении задач' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;

        const result = await pool.query(
            'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
            [title, description, 'active']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании задачи' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при обновлении задачи' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

        res.json({ message: 'Задача удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при удалении задачи' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});