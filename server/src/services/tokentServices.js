import jwt from 'jsonwebtoken';
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
