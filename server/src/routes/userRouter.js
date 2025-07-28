import express from 'express';
import { authenticate } from '../middlewares/Authenticate';
import { getSuggestedUsers } from '../controllers/getUserProfileController';
const userRouter = express.Router();
userRouter.get('/suggested', authenticate, getSuggestedUsers);
export default userRouter;