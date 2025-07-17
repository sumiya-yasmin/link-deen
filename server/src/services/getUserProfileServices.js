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


export const followUserService = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("You can't follow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new NotFoundError("User not found");
  }

  if (targetUser.followers.includes(currentUserId)) {
    throw new Error("Already following this user");
  }

  targetUser.followers.push(currentUserId);
  currentUser.following.push(targetUserId);

  await targetUser.save();
  await currentUser.save();
    return { currentUser, targetUser };
};


export const unfollowUserService = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new Error("User not found");
  }

  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId
  );

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId
  );

  await targetUser.save();
  await currentUser.save();
    return { currentUser, targetUser };
};