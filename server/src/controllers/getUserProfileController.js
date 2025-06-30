import User from '../models/user.js';
import {
  getAuthenticatedUserProfileById,
  getUserProfileById,
  updateUserBioService,
} from '../services/getUserProfileServices.js';
import uploadService from '../services/uploadService.js';

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
    const profile = await updateUserBioService(id, {name, username, bio});

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
