const router = require('express').Router();
const ProfileController = require('../controllers/ProfileController');

router.get("/", ProfileController.loadProfile);

module.exports = router;