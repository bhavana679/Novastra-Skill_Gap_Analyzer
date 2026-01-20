import mongoose from 'mongoose';

// Connect to MongoDB
const connectMongo = async () => {
    try {
        // Get the connection string from environment variables
        const mongoValue = process.env.MONGO_URI;

        if (!mongoValue) {
            console.log('Error: MONGO_URI is missing in .env file');
            return;
        }

        // Connect using Mongoose
        await mongoose.connect(mongoValue);

        console.log('✅ Successfully connected to MongoDB');
    } catch (error) {
        console.log('❌ Error connecting to MongoDB:', error.message);
        // Exit if we can't connect, because the server needs the database
        process.exit(1);
    }
};

export default connectMongo;
