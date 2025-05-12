import express from 'express';
import { getUserProfile } from '../controllers/getUserProfileController.js';
import { authenticate } from '../middlewares/Authenticate.js';
const profileRouter = express.Router();
profileRouter.get('/me',authenticate,getUserProfile);
export default profileRouter;