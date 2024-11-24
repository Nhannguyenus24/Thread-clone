const router = require('express').Router();
const AuthenticationController = require('../controllers/AuthenticationController');

router.get('/login', AuthenticationController.logIn);

router.get('/signup', AuthenticationController.signUp);

router.get('/resetpassword', AuthenticationController.resetPassword);

module.exports = router;