import express from 'express';
import { authenticate } from '../middlewares/Authenticate';
import { getSearchedUsers, getSuggestedUsers } from '../controllers/getUserProfileController';
const userRouter = express.Router();
userRouter.get('/suggested', authenticate, getSuggestedUsers);
userRouter.get('/search', authenticate, getSearchedUsers);
export default userRouter;