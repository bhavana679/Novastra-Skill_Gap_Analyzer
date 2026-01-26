import express from 'express';
import { selectTargetRole } from '../controllers/career.controller.js';

const router = express.Router();

router.post('/select', selectTargetRole);

export default router;
