import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connect database success');
    } catch (error) {  
        console.log('Connect database fail: ', error);
    }
}

export default { connectDatabase, cloudinary };