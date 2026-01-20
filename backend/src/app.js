import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
// This allows your frontend to talk to this backend
app.use(cors());

// Enable JSON parsing
// This allows the app to understand incoming JSON data
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
    res.send('Hello! The server is running perfectly.');
});

export default app;
