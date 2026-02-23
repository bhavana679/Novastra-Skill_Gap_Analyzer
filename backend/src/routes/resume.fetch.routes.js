import express from 'express';
import { getResumeById, getResumes } from '../controllers/resume.fetch.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/all', protect, getResumes);
router.get('/:id', protect, getResumeById);

export default router;
