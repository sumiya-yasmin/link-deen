import express from 'express';
import { getUserProfile } from '../controllers/getUserProfileController.js';
const profileRouter = express.Router();
profileRouter.get('/me', getUserProfile);
export default profileRouter;