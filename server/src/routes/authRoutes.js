import express from 'express';
import { signIn, signUp } from '../controllers/authController.js';
import validatePayload from '../middlewares/validation.js';
import { signinSchema, signupSchema } from '../validations/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', validatePayload(signupSchema), signUp);
authRouter.post('/signin', validatePayload(signinSchema), signIn)
export default authRouter;
