import express from 'express';
import { createLearningPath, getLearningPathByResumeId } from '../controllers/learningPath.controller.js';
import { updateSkillProgress } from '../controllers/progress.controller.js';
import { refineLearningPath } from '../controllers/aiLearningPath.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, createLearningPath);
router.post('/refine', protect, refineLearningPath);
router.get('/:resumeId', protect, getLearningPathByResumeId);
router.patch('/progress', protect, updateSkillProgress);

export default router;
