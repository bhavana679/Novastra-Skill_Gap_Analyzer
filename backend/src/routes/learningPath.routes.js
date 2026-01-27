import express from 'express';
import { createLearningPath } from '../controllers/learningPath.controller.js';
import { updateSkillProgress } from '../controllers/progress.controller.js';

const router = express.Router();

router.post('/generate', createLearningPath);
router.patch('/progress', updateSkillProgress);

export default router;
