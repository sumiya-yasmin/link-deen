import { authenticate } from '../middlewares/Authenticate.js';
import authRouter from './authRoutes.js';
import { postRouter } from './postRouter.js';
import profileRouter from './profileRouter.js';
import userRouter from './userRouter.js';

const configureRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/', profileRouter);
  app.use('/post', authenticate, postRouter);
  app.use('/people', userRouter);
};

export default configureRouter;
