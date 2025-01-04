const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatbotRoutes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/login', authRoutes);
app.use('/chat',chatRoutes);

// Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:postId/comments', commentRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Health Feedback API is running.');
});

// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));            