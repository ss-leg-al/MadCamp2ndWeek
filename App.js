const express = require('express');
const path = require('path');
const mongoose = require('./config/db');
const cors = require('cors');

require('dotenv').config();


const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

const app = express();
// Middleware

app.use(cors({
  origin: '*' // 모든 도메인 허용 (개발 환경에서만 사용)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/login', authRoutes);
app.use('/chat', chatbotRoutes);
app.use('/news', newsRoutes);
app.use('/trainers', trainerRoutes);



// Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default Route
app.get('/', (req, res) => {
  res.send('Health Feedback API is running.');
});

// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log(`Server running on http://localhost:${PORT}`));