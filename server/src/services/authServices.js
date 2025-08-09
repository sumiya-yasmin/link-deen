import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { InvalidPasswordError, UserNotFoundError, UserSoftDeletedError } from '../utils/ApiError.js';
import { config } from '../config/index.js';
import { hashToken } from './tokentServices.js';

export const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const signInServices = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UserNotFoundError();
  }
 if (user.isDeleted) {
  throw new UserSoftDeletedError(user);
}
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new InvalidPasswordError();
  }
  return user;
};

export const signOutServices = async (refreshToken) => {
  if (!refreshToken) return;
  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const hashedToken = hashToken(refreshToken);

    // Clear the hashed token in DB if matched
    const result = await User.findOneAndUpdate(
      { _id: decoded._id, refreshToken: hashedToken },
      { refreshToken: null }
    );
    if (!result) {
      console.warn('No user found with this refresh token during logout');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Logout token verification failed:', error.message);
    // Don’t throw — we’ll still clear the cookie in the controller
  }
};
