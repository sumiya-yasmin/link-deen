import express from 'express';
import { config } from './config/index.js';
import connectDB from './config/db.js';
const app= express();
const port = config.PORT
app.use(express.json())
connectDB()
app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
})