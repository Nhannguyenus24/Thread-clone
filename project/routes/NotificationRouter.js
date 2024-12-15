import express from 'express';
const router = express.Router();
import NotificationController from '../controllers/NotificationController.js';

router.get("/", NotificationController.loadNotifications);
router.put("/:id", NotificationController.markAsRead);

export default router;