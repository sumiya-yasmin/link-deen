import express from 'express';
import cors from 'cors'
import { config } from './config/index.js';
import connectDB from './config/db.js';
import configureRouter from './routes/index.js';
const app= express();
const port = config.PORT;

//middleware
app.use(express.json());
app.use(cors(config.CORS.ORIGIN));

connectDB();
configureRouter(app);
app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
})