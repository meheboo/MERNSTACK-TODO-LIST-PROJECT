const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

router.get('/', async (req, res) => {
  const tasks = await Task.find();
  const today = new Date().toISOString().slice(0, 10);

  const updated = await Promise.all(
    tasks.map(async task => {
      if (task.status === 'Pending' && task.dueDate < today) {
        task.status = 'Overdue';
        await task.save();
      }
      return task;
    })
  );

  res.json(updated);
});

router.put('/complete/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send('Not found');
  task.status = 'Completed';
  task.completedAt = new Date();
  await task.save();
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

router.get('/filter/:type', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  let filter = {};

  switch (req.params.type) {
    case 'pending': filter.status = 'Pending'; break;
    case 'completed': filter.status = 'Completed'; break;
    case 'overdue': filter.status = 'Overdue'; break;
    case 'today': filter.dueDate = today; break;
    case 'tomorrow': filter.dueDate = tomorrow; break;
    default: break;
  }

  const tasks = await Task.find(filter);
  res.json(tasks);
});

module.exports = router;