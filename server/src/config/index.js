import dotenv from 'dotenv';
dotenv.config()
export const config = {
    PORT: process.env.PORT,
    db: {
      MONGO_URI: process.env.MongoURI,
    //   Mongo_DBName: process.env.dbName,
    },
    CORS: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }
  };