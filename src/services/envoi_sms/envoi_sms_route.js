const express = require('express');
const router = express.Router();
const authMiddleware = require("./../../middlewares/auth_middleware");
const smsController = require('./controllers/envoi_sms_controller');

router.post('/send', smsController.sendSMS);
router.post('/send-to-contacts', smsController.sendSMSToContacts);

module.exports = router;
