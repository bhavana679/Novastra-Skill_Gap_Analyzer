import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.middleware.js';

import resumeRoutes from './routes/resume.routes.js';
import careerRoutes from './routes/career.routes.js';
import learningPathRoutes from './routes/learningPath.routes.js';
import aiLearningPathRoutes from './routes/aiLearningPath.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

app.use(cors());
app.use(logger);

app.use(express.json());

app.use('/api/resume', resumeRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/learning-path', aiLearningPathRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is connected!' });
});

app.get('/', (req, res) => {
    res.send('Hello! The server is running perfectly.');
});

export default app;
