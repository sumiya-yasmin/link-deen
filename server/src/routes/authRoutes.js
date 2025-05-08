import express from 'express';
import { signUp } from '../controllers/authController.js';
import validatePayload from '../middlewares/validation.js';
import { signupSchema } from '../validations/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', validatePayload(signupSchema), signUp);
export default authRouter;
