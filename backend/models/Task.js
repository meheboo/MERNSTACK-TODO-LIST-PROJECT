const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  status: { type: String, enum: ['Pending', 'Completed', 'Overdue'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Task', TaskSchema);