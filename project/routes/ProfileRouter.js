import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

// Để theo thứ tự vì các hàm sẽ chạy theo thứ tự
router.get("/", ProfileController.loadUserProfileData);

router.get('/configProfile', ProfileController.redirectToSettings);

export default router;