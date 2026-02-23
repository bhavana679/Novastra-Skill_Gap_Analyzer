import mongoose from 'mongoose';

const connectMongo = async () => {
    try {
        const mongoValue = process.env.MONGO_URI;

        if (!mongoValue) {
            console.log('Error: MONGO_URI is missing in .env file');
            return;
        }

        await mongoose.connect(mongoValue);

        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectMongo;
