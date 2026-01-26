import express from 'express';
import cors from 'cors';

import resumeRoutes from './routes/resume.routes.js';
import resumeFetchRoutes from './routes/resume.fetch.routes.js';
import careerRoutes from './routes/career.routes.js';
import learningPathRoutes from './routes/learningPath.routes.js';
import aiLearningPathRoutes from './routes/aiLearningPath.routes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/resume', resumeRoutes);
app.use('/api/resume', resumeFetchRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/learning-path', aiLearningPathRoutes);

app.get('/', (req, res) => {
    res.send('Hello! The server is running perfectly.');
});

export default app;
