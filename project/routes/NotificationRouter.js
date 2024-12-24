import express from 'express';
const router = express.Router();
import NotificationController from '../controllers/NotificationController.js';

router.get("/", NotificationController.loadNotifications);
router.put("/:id", NotificationController.markAsRead);
router.put("/delete/:id", NotificationController.deleteNotification);
export default router;