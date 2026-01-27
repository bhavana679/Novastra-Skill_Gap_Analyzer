import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { uploadResume, compareResumeVersions } from '../controllers/resume.controller.js';

const router = express.Router();

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/compare', compareResumeVersions);

export default router;
