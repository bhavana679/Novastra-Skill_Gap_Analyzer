import express from 'express';
import { getResumeById } from '../controllers/resume.fetch.controller.js';

const router = express.Router();

// Route to get a specific resume by its ID
router.get('/:id', getResumeById);

export default router;
