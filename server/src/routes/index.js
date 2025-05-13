import authRouter from './authRoutes.js';
import profileRouter from './profileRouter.js';

const configureRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/auth', profileRouter);
};

export default configureRouter;
