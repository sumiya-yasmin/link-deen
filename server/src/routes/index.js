import { authenticate } from '../middlewares/Authenticate.js';
import authRouter from './authRoutes.js';
import { postRouter } from './postRouter.js';
import profileRouter from './profileRouter.js';

const configureRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/auth', profileRouter);
  app.use('/post', authenticate, postRouter);
};

export default configureRouter;
