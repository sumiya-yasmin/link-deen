import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import {InvalidPasswordError, UserNotFoundError } from '../utils/ApiError.js';

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
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new InvalidPasswordError();
  }
  return user;
};
