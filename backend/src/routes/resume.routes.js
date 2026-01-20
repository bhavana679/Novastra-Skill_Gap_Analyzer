import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { uploadResume } from '../controllers/resume.controller.js';

const router = express.Router();

// Define the POST route for uploading a resume
// 'upload' middleware handles the file parsing within the 'resume' field
router.post('/upload', upload.single('resume'), uploadResume);

export default router;
