import express from 'express';
import { getResumeById } from '../controllers/resume.fetch.controller.js';

const router = express.Router();

router.get('/all', getResumes);
router.get('/:id', getResumeById);

export default router;
