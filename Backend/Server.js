const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const taskRoutes = require('./routes/routes'); // your task router
require('./config/Mongodb'); // MongoDB connection
require('dotenv').config({ path: './.env' });
const authRoutes = require('../AuthRoutes/AuthController")

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
  ],
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// Task Routes
app.use('/api/tasks', taskRoutes); 

//auth Routes
app.use('/api/auth' , authRoutes)
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Task Service running', version: '1.0.0' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error(`Server error: ${error.message}`, { error });
  res.status(error.statusCode || 500).json({
    error: {
      message: error.message || 'Internal server error',
      statusCode: error.statusCode || 500
    },
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = 3005;
app.listen(PORT, () => {
  logger.info(`Task Service running on port ${PORT}`);
});


