import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { createUser, signInServices } from '../services/authServices.js';
import { generateTokens } from '../services/tokentServices.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';

export const signUp = async (req, res) => {
  try {
    const { username, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    const user = await createUser(req.body);
    const tokens = generateTokens(user);
    res
      .status(201)
      .json({ message: 'User created successfully', user, tokens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signIn = async (req, res) => {
  const { email, password} = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

      const user = await signInServices(email, password);
      const tokens = generateTokens(user);
      return res.status(200).json(tokens);
  } catch (error) {
 
    console.error('Unexpected error during sign in:', error);
    if (error instanceof ApiError) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    // Optional: Check if user still exists (security best practice)
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};



// export const signIn = async (req, res) => {
//   const { email, password, tokens } = req.body;

//   try {
//     if (email && password) {
//       const user = await signInServices(email, password);
//       const tokens = generateTokens(user);
//       return res.status(200).json(tokens);
//     }
//     if (refreshToken) {
//       jwt.verify(refreshToken, config.JWT_SECRET, async (err, payload) => {
//         if (err)
//           return res.status(401).json({ message: 'Invalid refresh token' });
//         const user = await User.findById(payload._id);
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         const tokens = generateTokens(user);
//         return res.status(200).json(tokens);
//       });
//     }else {
//       return res.status(400).json({ message: 'Provide email/password or refreshToken' });
//     };
//     return res.status(200).json({ message: 'Sign in successful', tokens });
//   } catch (error) {
//     console.log('ERROR TYPE:', error.constructor.name);
//     console.log('IS API ERROR:', error instanceof ApiError);
//     console.error('FULL ERROR:', error);
//     if (error instanceof ApiError) {
//       return res.status(401).json({ message: error.message });
//     }
//     console.error('Unexpected error during sign in:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };
