import { config } from '../config/index.js';
import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Add user ID to request
    req._id = decoded._id;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};
