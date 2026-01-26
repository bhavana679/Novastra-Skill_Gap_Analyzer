import express from 'express';
import { createLearningPath } from '../controllers/learningPath.controller.js';

const router = express.Router();

router.post('/generate', createLearningPath);

export default router;
