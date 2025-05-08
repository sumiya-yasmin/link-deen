import authRouter from './authRoutes.js';

const configureRouter = (app) => {
  app.use('/auth', authRouter);
};

export default configureRouter;
