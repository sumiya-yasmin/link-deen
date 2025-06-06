import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/index.js';
export const generateTokens = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '5m',
  });
  const refreshToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '6h',
  });

  return { accessToken, refreshToken };
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
