import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this file contains the enhanced styles

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
  });

  // Load tasks from backend
  const loadTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!form.title || !form.dueDate) {
      return alert('⚠️ Title and Due Date are required');
    }
    try {
      await axios.post('http://localhost:5000/api/tasks', form);
      setForm({ title: '', description: '', dueDate: '', priority: 'Low' });
      loadTasks();
    } catch (error) {
      console.error('❌ Error adding task:', error);
    }
  };

  // Mark task as complete
  const markComplete = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/complete/${id}`);
      loadTasks();
    } catch (error) {
      console.error('❌ Error marking task complete:', error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      loadTasks();
    } catch (error) {
      console.error('❌ Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <h1>📝 Smart To-Do List</h1>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="date"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <button onClick={addTask}>Add Task</button>

      <h2>📋 Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={task.status.toLowerCase()}>
            <b>{task.title}</b> | {task.status} | Due: {task.dueDate} | Priority: {task.priority}
            <br />
            <small>{task.description}</small>
            <br />
            <button onClick={() => markComplete(task._id)}>✔</button>
            <button onClick={() => deleteTask(task._id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
