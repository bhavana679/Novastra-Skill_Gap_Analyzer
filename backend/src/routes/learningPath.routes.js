import express from 'express';
import { createLearningPath, getLearningPathByResumeId } from '../controllers/learningPath.controller.js';
import { updateSkillProgress } from '../controllers/progress.controller.js';

const router = express.Router();

router.post('/generate', createLearningPath);
router.get('/:resumeId', getLearningPathByResumeId);
router.patch('/progress', updateSkillProgress);

export default router;
