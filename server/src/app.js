import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { config } from './config/index.js';
import connectDB from './config/db.js';
import configureRouter from './routes/index.js';
import { configureCloudinary } from './config/cloudinary.js';
const app= express();
const port = config.PORT;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.CORS));

connectDB();
configureCloudinary();
configureRouter(app);
app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
})