import express from 'express';
import { getResourceRecommendations } from '../controllers/resource.controller.js';

const router = express.Router();

// Define the route to get recommendations based on a resume ID
// This will be accessible at POST /api/resources/recommend
router.post('/recommend', getResourceRecommendations);

export default router;
