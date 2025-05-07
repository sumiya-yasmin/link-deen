import mongoose from 'mongoose';
import { config } from './index.js'

const connectDB = async() => {
try {
    mongoose.connect(config.db.MONGO_URI);
    console.log('MongoDB connected');
} catch (error) {
    console.error('MongoDB connection failed:', error.message);
}
}
export default connectDB;