import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.middleware.js';

import resumeRoutes from './routes/resume.routes.js';
import careerRoutes from './routes/career.routes.js';
import learningPathRoutes from './routes/learningPath.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(logger);

app.use(express.json());

app.use('/api/resume', resumeRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is connected!' });
});

app.get('/', (req, res) => {
    res.send('Hello! The server is running perfectly.');
});

app.use(notFound);
app.use(errorHandler);

export default app;
