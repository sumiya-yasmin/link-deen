import express from 'express';
import { getAuthenticatedUserProfile, getUserProfile} from '../controllers/getUserProfileController.js';
import { authenticate } from '../middlewares/Authenticate.js';
const profileRouter = express.Router();
profileRouter.get('/auth/me',authenticate,getAuthenticatedUserProfile);
profileRouter.get('/profile/:id', getUserProfile)
export default profileRouter;