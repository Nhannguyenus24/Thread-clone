import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'drddzd0eh',
    secure: true,
    api_key: "513136425836428",
    api_secret: "b0HFLf-ESI9q8ZChQFIYESVBvZU",
});

async function connectDatabase() {
    try {
        await mongoose.connect('mongodb+srv://ntnhan223:7ITLgLkjbGVn5A29@thread.vcjq5.mongodb.net/');
        console.log('Connect database success');
    } catch (error) {  
        console.log('Connect database fail: ', error);
    }
}

export default { connectDatabase, cloudinary };