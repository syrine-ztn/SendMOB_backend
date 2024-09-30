const express = require('express');
const router = express.Router();
const authMiddleware = require("./../../middlewares/auth_middleware");
const smsController = require('./controllers/envoi_sms2_controller');

router.post('/send', smsController.sendSMS);
router.post('/send-to-contacts',authMiddleware('client'),smsController.sendSMSToContacts);
router.post('/send-to-selected-contacts',authMiddleware('client'),smsController.sendSMSToSelectedContacts);
router.post('/sendPwd', smsController.sendSMSPwd);

module.exports = router;
