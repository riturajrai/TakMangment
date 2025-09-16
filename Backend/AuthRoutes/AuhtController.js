
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const winston = require('winston');
const { body, validationResult } = require('express-validator');

// -------------------- LOGGER --------------------
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
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// -------------------- CONFIG --------------------
const CONFIG = {
  JWT_EXPIRY: '1d',
  BCRYPT_SALT_ROUNDS: 10,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here'
};

// -------------------- USER MODEL --------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// -------------------- CUSTOM ERROR --------------------
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// -------------------- VALIDATION --------------------
const validateSignup = [
  body('name').isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isStrongPassword().withMessage('Password must be strong'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];

// -------------------- SIGNUP --------------------
router.post('/signup', validateSignup, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError(400, 'Email already registered');

    const hashedPassword = await bcrypt.hash(password, CONFIG.BCRYPT_SALT_ROUNDS);
    const newUser = await User.create({ name, email, password: hashedPassword });

    logger.info(`User registered: ${newUser.email}`);

    res.status(201).json({
      message: 'Signup successful',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    next(error.statusCode ? error : new AppError(500, 'Internal server error'));
  }
});

// -------------------- LOGIN --------------------
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, errors.array()[0].msg);
    }

    const { email, password } = req.body;
    logger.info(`Login attempt: ${email}`);

    const user = await User.findOne({ email });
    if (!user) throw new AppError(401, 'Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(401, 'Invalid email or password');

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      CONFIG.JWT_SECRET,
      { expiresIn: CONFIG.JWT_EXPIRY }
    );

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error.statusCode ? error : new AppError(500, 'Internal server error'));
  }
});

// -------------------- ERROR HANDLER --------------------
router.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: error.message || 'Internal server error',
      statusCode,
      isOperational: error.isOperational
    }
  });
});

module.exports = router;
