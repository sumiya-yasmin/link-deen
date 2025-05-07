import User from '../models/user.js';
import { createUser } from '../services/authServices';

export const signUp = async (req, res) => {
  try {
    const existingUser = User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    const user = await createUser(req.body);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
