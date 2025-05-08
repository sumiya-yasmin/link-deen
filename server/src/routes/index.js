import authRouter from './authRoutes';

const configureRouter = (app) => {
  app.use('/auth', authRouter);
};

export default configureRouter;
