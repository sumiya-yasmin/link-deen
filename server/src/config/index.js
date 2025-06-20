import dotenv from 'dotenv';
dotenv.config()

export const config = {
    PORT: process.env.PORT,
    db: {
      MONGO_URI: process.env.MongoURI,
    //   Mongo_DBName: process.env.dbName,
    },
    CORS: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
       methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
    },
    JWT_SECRET: process.env.JWT_SECRET
  };