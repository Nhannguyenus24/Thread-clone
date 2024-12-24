import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';

router.put('/follow/:id', ProfileController.FollowUser);
router.get('/configProfile', ProfileController.redirectToSettings);
router.get('/:username', ProfileController.loadOtherProfileData);
router.get("/", ProfileController.loadUserProfileData);
router.delete("/delete-thread/:id", ProfileController.deleteThread);
export default router;