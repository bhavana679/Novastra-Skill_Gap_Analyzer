import dotenv from 'dotenv';
import app from './app.js';
import connectMongo from './config/mongo.js';

// Load .env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectMongo();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
