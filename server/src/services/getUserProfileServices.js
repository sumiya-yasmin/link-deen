import User from '../models/user.js';

export const getAuthenticatedUserProfileById = async (id) => {
  const profile = await User.findById(id).select('-password -refreshToken');
  if (!profile) {
    throw new Error('User not found');
  }
  return profile;
};

export const getUserProfileById = async (id) => {
  const profile = await User.findById(id).select('-password -refreshToken');
  return profile;
};

export const updateUserProfileService = async (id, updates) => {

  const allowedFields = ['name', 'username', 'bio'];
  const filteredUpdates = {};
  for(const key of allowedFields){
    if(key in updates){
      filteredUpdates[key] = updates[key];
    }
  }
  const updatedProfile = await User.findByIdAndUpdate(
    id,
    filteredUpdates,
    { new: true }
  ).select('-password -refreshToken');
  return updatedProfile;
};
