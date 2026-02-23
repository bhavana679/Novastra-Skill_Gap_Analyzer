import express from 'express';
import upload from '../middleware/upload.middleware.js';
import {
    uploadResume,
    compareResumeVersions,
    getAllResumes
} from '../controllers/resume.controller.js';
import { getResumeById } from '../controllers/resume.fetch.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Analytics & Comparison
router.get('/compare', protect, compareResumeVersions);

// Resume Upload & Core Data
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/all', protect, getAllResumes);
router.get('/:id', protect, getResumeById);

export default router;
