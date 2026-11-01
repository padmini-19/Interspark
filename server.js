const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();



const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true                // MANDATORY: Allows cookies to pass through CORS
}));

// 2. PARSE COOKIES
app.use(cookieParser()); 

app.use(express.json());

// 2. Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 3. Global Error Handling Middleware (MUST stay below all routes)
app.use(errorHandler);

// 4. Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));