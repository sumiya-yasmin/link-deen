import User from '../models/user.js';

export const getAuthenticatedUserProfileById = async(id) => {
  const profile = await User.findById(id).select('-password -refreshToken');
  if (!profile) {
    throw new Error('User not found');
  }
  return profile;
};

