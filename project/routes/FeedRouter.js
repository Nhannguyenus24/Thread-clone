import express from 'express';
const router = express.Router();
import FeedController from '../controllers/FeedController.js';

router.get('/', FeedController.loadFeed);

router.post('/like', FeedController.likeThread);

export default router;