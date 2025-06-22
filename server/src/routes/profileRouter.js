import express from 'express';
import { getAuthenticatedUserProfile} from '../controllers/getUserProfileController.js';
import { authenticate } from '../middlewares/Authenticate.js';
const profileRouter = express.Router();
profileRouter.get('/auth/me',authenticate,getAuthenticatedUserProfile);
export default profileRouter;