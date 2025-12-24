const express = require('express');
const router = express.Router();
const { tokenVerification } = require('../middleware/auth.middleware');
const settingController  = require('../controllers/settings.controller')

router.post('/create-settings', tokenVerification, settingController.createSettings);
router.post('/update-settings/:id', tokenVerification, settingController.updateSettings);
router.get('/get-settings',  settingController.getSettings);
// router.delete('/delete-task/:id', tokenVerification, taskController.deleteTask);

module.exports = router;
  