import express from 'express';
const router = express.Router();
import NewThreadController from '../controllers/NewThreadController.js';

router.get("/", NewThreadController.newThread);

export default router;