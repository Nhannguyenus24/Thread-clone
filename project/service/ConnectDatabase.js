import mongoose from 'mongoose';

async function connectDatabase() {
    try {
        await mongoose.connect('mongodb+srv://ntnhan223:7ITLgLkjbGVn5A29@thread.vcjq5.mongodb.net/');
        console.log('Connect database success');
    } catch (error) {  
        console.log('Connect database fail: ', error);
    }
}

export default connectDatabase;