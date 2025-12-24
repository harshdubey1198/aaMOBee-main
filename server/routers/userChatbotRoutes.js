const express = require('express');
const router = express.Router();
const userChatbotController = require('../controllers/userChatbotController');


router.post('/data', userChatbotController.submitUserWithChat);

module.exports = router;
