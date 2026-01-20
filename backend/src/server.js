import dotenv from 'dotenv';
import app from './app.js';
import connectMongo from './config/mongo.js';

// Load .env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the server
const startServer = async () => {
    // Connect to DB first
    await connectMongo();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT} to see it in action`);
    });
};

startServer();
