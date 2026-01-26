import express from 'express';
import { refineLearningPath } from '../controllers/aiLearningPath.controller.js';

const router = express.Router();


router.post('/refine', refineLearningPath);

export default router;
