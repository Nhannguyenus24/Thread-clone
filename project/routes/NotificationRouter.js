const router = require('express').Router();
const NotificationController = require('../controllers/NotificationController');

router.get("/", NotificationController.loadNotifications);

module.exports = router;