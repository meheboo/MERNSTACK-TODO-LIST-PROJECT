const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

// ✅ FIX: Remove deprecated options
mongoose.connect('mongodb://localhost:27017/Task')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
