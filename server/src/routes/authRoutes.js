import express from 'express';
import { refreshAccessToken, signIn, signUp } from '../controllers/authController.js';
import validatePayload from '../middlewares/validation.js';
import { signinSchema, signupSchema } from '../validations/auth.js';
import { getUserProfile } from '../controllers/getUserProfileController.js';

const authRouter = express.Router();

authRouter.post('/signup', validatePayload(signupSchema), signUp);
authRouter.post('/signin', validatePayload(signinSchema), signIn);
authRouter.post('/refresh', refreshAccessToken);
authRouter.get('/me', getUserProfile);
authRouter.get('/debug-cookies', (req, res) => {
  console.log('Cookies received:', req.cookies);
  res.json({ 
    cookies: req.cookies,
    hasRefreshToken: !!req.cookies.refreshToken,
    message: 'Check your server console for cookie details'
  });
});
export default authRouter;
