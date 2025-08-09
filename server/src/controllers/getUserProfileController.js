import User from '../models/user.js';
import {
  deleteProfileService,
  followUserService,
  getAuthenticatedUserProfileById,
  getFollowersServices,
  getFollowingServices,
  getSearchedUsersService,
  getSuggestedUsersService,
  getUserProfileById,
  restoreSoftDeletedProfileService,
  softDeleteProfileService,
  unfollowUserService,
  updateUserProfileService,
} from '../services/getUserProfileServices.js';
import uploadService from '../services/uploadService.js';
import { UserNotFoundError } from '../utils/ApiError.js';

export const getAuthenticatedUserProfile = async (req, res) => {
  const id = req._id;
  try {
    const profile = await getAuthenticatedUserProfileById(id);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: profile._id,
      name: profile.name,
      email: profile.email,
      username: profile.username,
      imageUrl: profile.imageUrl || '/assets/profile-placeholder.png',
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await getUserProfileById(id);
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: profile._id,
      name: profile.name,
      email: profile.email,
      username: profile.username,
      imageUrl: profile.imageUrl || '/assets/profile-placeholder.png',
      coverImageUrl: profile.coverImageUrl,
      bio: profile.bio,
      createdAt: profile.createdAt,
      stats: {
        postsCount: profile.posts?.length || 0,
        followersCount: profile.followers?.length || 0,
        followingCount: profile.following?.length || 0,
        followers: (profile.followers || []).map((f) =>
          f._id ? f._id.toString() : f.toString()
        ),
        following: (profile.following || []).map((f) =>
          f._id ? f._id.toString() : f.toString()
        ),
      },
    });
  } catch (error) {
    console.error('Get public user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadUserImage = async (req, res) => {
  try {
    const { imageType } = req.body;
    const userId = req._id;
    if (!req.file || !['profile', 'cover'].includes(imageType)) {
      return res.status(400).json({ error: 'Invalid upload request' });
    }
    const imageUrl = await uploadService.uploadImage(req.file);
    const updatedData =
      imageType === 'profile' ? { imageUrl } : { coverImageUrl: imageUrl };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    ).select('imageUrl coverImageUrl name username');
    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

export const deleteUserImage = async (req, res) => {
  try {
    const userId = req._id;
    const { imageUrl, imageType } = req.body;

    if (!imageUrl || !['profile', 'cover'].includes(imageType)) {
      return res.status(400).json({ error: 'Invalid deletion request' });
    }

    await uploadService.deleteImage(imageUrl);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          [imageType === 'profile' ? 'imageUrl' : 'coverImageUrl']: 1,
        },
      },
      { new: true }
    ).select('imageUrl coverImageUrl name username');

    res.status(200).json({
      success: true,
      message: `${imageType} image deleted successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Image deletion error:', error.message);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

export const updateUserProfile = async (req, res) => {
  const id = req._id;
  const { name, username, bio } = req.body;

  if (bio && (typeof bio !== 'string' || bio.length > 300)) {
    return res
      .status(400)
      .json({ error: 'Bio must be a string up to 300 characters.' });
  }

  if (name && typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string.' });
  }

  if (username && typeof username !== 'string') {
    return res.status(400).json({ error: 'Username must be a string.' });
  }

  try {
    const profile = await updateUserProfileService(id, { name, username, bio });

    if (!profile) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
};

export const followUserController = async (req, res) => {
  const currentUserId = req._id;
  const { userId: targetUserId } = req.params;
  try {
    const { currentUser, targetUser } = await followUserService(
      currentUserId,
      targetUserId
    );
    res.status(200).json({
      message: 'Followed successfully',
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
      followers: targetUser.followers.map((f) =>
        f.toString ? f.toString() : f
      ),
      following: currentUser.following.map((f) =>
        f.toString ? f.toString() : f
      ),
    });
  } catch (error) {
    console.error('Follow user error:', error.message);
    if (
      error.message.includes('Cannot follow yourself') ||
      error.message.includes('Already following')
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const unfollowUserController = async (req, res) => {
  const currentUserId = req._id;
  const { userId: targetUserId } = req.params;
  try {
    const { currentUser, targetUser } = await unfollowUserService(
      currentUserId,
      targetUserId
    );
    res.status(200).json({
      message: 'Unfollowed successfully',
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
      followers: targetUser.followers.map((f) =>
        f.toString ? f.toString() : f
      ),
      following: currentUser.following.map((f) =>
        f.toString ? f.toString() : f
      ),
    });
  } catch (error) {
    console.error('Unfollow user error:', error.message);
    if (error.message.includes('Cannot unfollow yourself')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSuggestedUsers = async (req, res) => {
  const currentUserId = req._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const result = await getSuggestedUsersService(currentUserId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('suggested users error:', error.message);
    res.status(500).json({ message: 'error fetching suggested users', error });
  }
};

export const getSearchedUsers = async (req, res) => {
  const query = req.query.que || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const result = await getSearchedUsersService(query, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('searched users error:', error.message);
    res.status(500).json({ message: 'error fetching searched users', error });
  }
};

export const getFollowers = async (req, res) => {
  const userId = req._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const result = await getFollowersServices(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Get followers error:', error.message);
    res.status(500).json({ message: 'Error fetching followers', error });
  }
};

export const getFollowing = async (req, res) => {
  const userId = req._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  console.log('Backend received page:', page);

  try {
    const result = await getFollowingServices(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Get followers error:', error.message);
    res.status(500).json({ message: 'Error fetching followers', error });
  }
};

export const deleteProfile = async (req, res) => {
  const id = req._id;
  try {
    await deleteProfileService(id);
    res.status(200).json({
      message: 'User profile deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error DEleting profile', error });
  }
};

export const softdeleteProfile = async (req, res) => {
  const userId = req._id;
  try {
    await softDeleteProfileService(userId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    });
    res.status(200).json({
      message: 'User account deactivated and logged out successfully',
    });
  } catch (error) {
    console.error('Soft delete error:', error);
    res
      .status(500)
      .json({ message: 'Internal server error during soft delete' });
  }
};

export const restoreSoftDeletedProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await restoreSoftDeletedProfileService(email, password);
    res.status(200).json({
      message: 'Account restored successfully. Please sign in to continue',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Soft delete error:', error);

    if (
      error.message === 'No restorable account found with this email' ||
      error.message === 'Invalid password'
    ) {
      return res.status(401).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: 'Internal server error during restoration' });
  }
};
