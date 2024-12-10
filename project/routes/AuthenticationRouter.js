import express from 'express';
const router = express.Router();
import AuthenticationController from '../controllers/AuthenticationController.js';

router.get('/login', AuthenticationController.logIn);

router.post('/api/login', AuthenticationController.checkLogIn);

router.get('/signup', AuthenticationController.register);

router.get('/resetpassword', AuthenticationController.resetPassword);

router.post('/api/register', AuthenticationController.registerUser);

router.get('/api/verify/:token', AuthenticationController.verifyUser);

router.post('/api/resend-verification-token', AuthenticationController.resendVerificationToken);


export default router;