const router = require('express').Router();
const NewThreadController = require('../controllers/NewThreadController');

router.get("/", NewThreadController.newThread);

module.exports = router;