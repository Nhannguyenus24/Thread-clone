const router = require('express').Router();
const SettingController = require('../controllers/SettingController');

router.get('/account', SettingController.settingAccount);
router.get('/help', SettingController.help);

module.exports = router;