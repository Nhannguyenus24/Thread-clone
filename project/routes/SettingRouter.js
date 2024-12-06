import express from 'express';
const router = express.Router();
import SettingController from '../controllers/SettingController.js';

router.get('/account', SettingController.settingAccount);
router.get('/help', SettingController.help);
router.post('/change', SettingController.changeSetting);
router.post('/password', SettingController.changePassword);

export default router;