import User from '../models/user.js';

export const getAuthenticatedUserProfileById = async (id) => {
  const profile = await User.findById(id).select('-password -refreshToken');
  if (!profile) {
    throw new Error('User not found');
  }
  return profile;
};

export const getUserProfileById = async (id) => {
  const profile = await User.findById(id)
    .select('-password -refreshToken')
    .populate('followers', '_id name username imageUrl')
    .populate('following', '_id name username imageUrl');
  return profile;
};

export const updateUserProfileService = async (id, updates) => {
  const allowedFields = ['name', 'username', 'bio'];
  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (key in updates) {
      filteredUpdates[key] = updates[key];
    }
  }
  const updatedProfile = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
  }).select('-password -refreshToken');
  return updatedProfile;
};

export const followUserService = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("You can't follow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new NotFoundError('User not found');
  }

  if (targetUser.followers.includes(currentUserId)) {
    throw new Error('Already following this user');
  }

  const updatedCurrentUser = await User.findByIdAndUpdate(
    currentUserId,
    { $addToSet: { following: targetUserId } },
    { new: true }
  );

  const updatedTargetUser = await User.findByIdAndUpdate(
    targetUserId,
    { $addToSet: { followers: currentUserId } },
    { new: true }
  );
  return { currentUser: updatedCurrentUser, targetUser: updatedTargetUser };
};

export const unfollowUserService = async (currentUserId, targetUserId) => {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (currentUserId === targetUserId) {
    throw new Error('Cannot unfollow yourself');
  }
  if (!currentUser || !targetUser) {
    throw new Error('User not found');
  }

  const updatedCurrentUser = await User.findByIdAndUpdate(
    currentUserId,
    { $pull: { following: targetUserId } },
    { new: true }
  );

  const updatedTargetUser = await User.findByIdAndUpdate(
    targetUserId,
    { $pull: { followers: currentUserId } },
    { new: true }
  );
  if (!updatedCurrentUser || !updatedTargetUser) {
    throw new Error('User not found');
  }
  return { currentUser: updatedCurrentUser, targetUser: updatedTargetUser };
};

export const getSuggestedUsersService = async (currentUserId, page, limit) => {
  const currentUser = await User.findById(currentUserId).populate(
    'following',
    '_id'
  );
  if (!currentUser) throw new Error('User Not Found');
  const followingUsersIds = currentUser.following.map((user) =>
    user._id.toString()
  );
  const skip = (page - 1) * limit;
  const [suggestedUsers, total] = await Promise.all([
    User.find({
      _id: { $nin: [currentUser, ...followingUsersIds] },
    })
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit),

    User.countDocuments({
      _id: { $nin: [currentUserId, ...followingUsersIds] },
    }),
  ]);
  return {
    suggestedUsers,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getSearchedUsersService = async (query, page, limit) => {
  const regex = new RegExp(query, 'i');
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find({
      $or: [{ username: regex }, { name: regex }],
    })
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit),
    User.countDocuments({
      $or: [{ username: regex }, { name: regex }],
    }),
  ]);
  return {
    users,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getFollowersServices = async (userId, page, limit) => {
  const user = await User.findById(userId).select('followers');
  if (!user) throw new NotFoundError('User not found');

  const total = user.followers.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const paginatedFollowersIds = user.followers.slice(start, end);

  const followers = await User.find({
    _id: { $in: paginatedFollowersIds },
  }).select('name username imageUrl');

  return {
    followers,
    total,
    currentPage,
    totalPages,
  };
};

export const getFollowingServices = async (userId, page, limit) => {
  const user = await User.findById(userId).select('following');
  if (!user) throw new NotFoundError('User not found');

  const total = user.following.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const paginatedFollowingIds = user.following.slice(start, end);
  const following = await User.find({
    _id: { $in: paginatedFollowingIds },
  }).select('name username imageUrl');

  return {
    following,
    total,
    currentPage,
    totalPages,
  };
};

export const deleteProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  return await User.findByIdAndDelete(userId);
};

export const softDeleteProfileService = async (userId) => {
  const deleteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const user = await User.findByIdAndUpdate(
    userId,
    {
      isDeleted: true,
      deletionScheduledAt: deleteAt,
      refreshToken: null,
    },
    { new: true }
  );
  if (!user) throw new Error('User not found');
};

export const restoreSoftDeletedProfileService = async (userId) => {
  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
      isDeleted: true,
      deletionScheduledAt: { $gt: new Date() },
    },
    {
      isDeleted: false,
      deleteScheduledAt: null,
    },
    {
      new: true,
    }
  );
};
