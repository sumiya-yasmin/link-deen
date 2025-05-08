import express from 'express';
import { signUp } from '../controllers/authController';
import validatePayload from '../middlewares/validation';
import { signupSchema } from '../validations/auth';

const authRouter = express.Router();

router.post('/signup', validatePayload(signupSchema), signUp);
export default authRouter;
