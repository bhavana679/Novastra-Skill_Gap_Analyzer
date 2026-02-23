import express from 'express';
import { handleChat, getChatHistory } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected chat routes to enable memory/history
router.post('/chat', protect, handleChat);
router.get('/history', protect, getChatHistory);

export default router;
