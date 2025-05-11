import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { createUser, signInServices } from '../services/authServices.js';
import { generateTokens } from '../services/tokentServices.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';

const setRefreshToken = (res, refreshToken) =>{
   res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
   })
};

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
      const {accessToken, refreshToken} = generateTokens(user);
      setRefreshToken(res, refreshToken);

      return res.status(200).json({accessToken, user:{
        id: user._id,
        username: user.username,
        email: user.email,
      }});
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
    const { refreshToken } = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    // Optional: Check if user still exists (security best practice)
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
     user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshToken(res, newRefreshToken);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
     res.status(500).json({ message: 'Server error' });
  }
};


