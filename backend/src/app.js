import express from 'express';
import cors from 'cors';

import resumeRoutes from './routes/resume.routes.js';
import resumeFetchRoutes from './routes/resume.fetch.routes.js';
import careerRoutes from './routes/career.routes.js';

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/resume', resumeFetchRoutes);
app.use('/api/career', careerRoutes);


app.get('/', (req, res) => {
    res.send('Hello! The server is running perfectly.');
});

export default app;
