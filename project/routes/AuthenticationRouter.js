import express from 'express';
const router = express.Router();
import AuthenticationController from '../controllers/AuthenticationController.js';

router.get('/login', AuthenticationController.logIn);

router.get('/signup', AuthenticationController.signUp);

router.get('/resetpassword', AuthenticationController.resetPassword);

export default router;