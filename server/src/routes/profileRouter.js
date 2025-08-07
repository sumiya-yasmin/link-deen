import express from 'express';
import {
  deleteProfile,
  deleteUserImage,
  followUserController,
  getAuthenticatedUserProfile,
  getUserProfile,
  softdeleteProfile,
  unfollowUserController,
  updateUserProfile,
  uploadUserImage,
} from '../controllers/getUserProfileController.js';
import { authenticate } from '../middlewares/Authenticate.js';
import { upload } from '../middlewares/upload.js';
const profileRouter = express.Router();
profileRouter.get('/auth/me', authenticate, getAuthenticatedUserProfile);
profileRouter.get('/profile/:id', getUserProfile);
profileRouter.post(
  '/profile/upload/image',
  authenticate,
  upload.single('file'),
  uploadUserImage
);
profileRouter.delete('/profile/hard-delete/:id', authenticate, deleteProfile);
profileRouter.delete('/profile/delete/:id', authenticate, softdeleteProfile);

profileRouter.delete('/profile/delete/image', authenticate, deleteUserImage);
profileRouter.put('/profile', authenticate, updateUserProfile);
profileRouter.put('/:userId/follow', authenticate, followUserController);
profileRouter.put('/:userId/unfollow', authenticate, unfollowUserController);


export default profileRouter;