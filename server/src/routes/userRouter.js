import express from 'express';
import { authenticate } from '../middlewares/Authenticate.js';
import { getSearchedUsers, getSuggestedUsers } from '../controllers/getUserProfileController.js';
const userRouter = express.Router();
userRouter.get('/suggested', authenticate, getSuggestedUsers);
userRouter.get('/search', authenticate, getSearchedUsers);
export default userRouter;