const jwt = require('jsonwebtoken');
const winston = require('winston');

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
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromCookie = req.cookies?.token;
  const token = tokenFromHeader || tokenFromCookie;

  logger.info(`Authenticating token: ${token ? token.slice(0, 10) + '...' : 'No token'}`);

  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    logger.info(`Decoded token for userId: ${decoded.userId}`);
    req.user = decoded; // { userId, email }
    next();
  } catch (error) {
    logger.error(`Token verification error: ${error.message}`, { error });
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
