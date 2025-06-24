import express from 'express';
import {
  getAuthenticatedUserProfile,
  getUserProfile,
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
export default profileRouter;
