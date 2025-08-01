import express from 'express';
import { authenticate } from '../middlewares/Authenticate.js';
import { getFollowers, getFollowing, getSearchedUsers, getSuggestedUsers } from '../controllers/getUserProfileController.js';
const userRouter = express.Router();
userRouter.get('/suggested', authenticate, getSuggestedUsers);
userRouter.get('/search', authenticate, getSearchedUsers);
userRouter.get('/:id/followers', authenticate, getFollowers);
userRouter.get('/:id/following', authenticate, getFollowing);
export default userRouter;