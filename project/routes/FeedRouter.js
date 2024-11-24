const router = require('express').Router();
const FeedController = require('../controllers/FeedController');

router.get('/', FeedController.loadFeed);

router.post('/like', FeedController.likeThread);

module.exports = router;