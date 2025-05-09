import User from '../models/user.js';
import { createUser, signInServices } from '../services/authServices.js';
import { ApiError } from '../utils/ApiError.js';

export const signUp = async (req, res) => {
  try {
    const { username, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    const user = await createUser(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await signInServices(email, password);
    return res.status(200).json({ message: 'Sign in successful', user });
  } catch (error) {
    console.log('ERROR TYPE:', error.constructor.name);
    console.log('IS API ERROR:', error instanceof ApiError);
    console.error('FULL ERROR:', error);
    if (error instanceof ApiError) {
      return res.status(401).json({ message: error.message });
    }
    console.error('Unexpected error during sign in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
