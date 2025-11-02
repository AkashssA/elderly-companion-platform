// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the db connection

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend! 👋' });
});

// Define Routes
// Define Routes
app.use('/api/auth', require('./routes/auth')); // <-- ADD THIS LINE
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/ai',require('./routes/ai'));
app.use('/api/alerts', require('./routes/alerts'));

app.use('/api/chat', require('./routes/chat'));
app.use('/api/entertainment', require('./routes/entertainment')); 
app.use('/api/events', require('./routes/events'));
app.use('/api/health', require('./routes/health')); 
app.use('/api/meals', require('./routes/meals'));
app.use('/api/photos', require('./routes/photos'));// <-- ADD THIS LINE
app.use('/api/notifications', require('./routes/notifications')); 
app.use('/api/community-events', require('./routes/communityEvents'))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// We will add these soon
// app.use('/api/auth', require('./routes/auth'));

