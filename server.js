const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const DATA_FILE = './tasks.json';

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h1 style="font-family:sans-serif;">✅ Task Manager API is running</h1>');
});

const readTasks = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'task title cannot be empty.' });
  }

  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    title: title.trim(),  
    completed: false
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});


app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = true;
    writeTasks(tasks);
    res.json(task);
  } else {
    res.status(404).json({ error: 'task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  const taskId = parseInt(req.params.id);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);
  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }
  writeTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(` server is running at http://localhost:${PORT}`);
});
