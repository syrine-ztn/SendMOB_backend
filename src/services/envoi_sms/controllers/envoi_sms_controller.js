const EnvoiSMSService = require('./../service/envoi_sms_service');

const envoiSMSService = new EnvoiSMSService();

async function sendSMS(req, res) {
  const { recipientPhoneNumber, message } = req.body;
  try {
    const sentMessage = await envoiSMSService.sendSMS(recipientPhoneNumber, message);
    res.json({ success: true, message: 'SMS sent successfully', data: sentMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function sendSMSToContacts(req, res) {
  const { clientId, message } = req.body;
  try {
    await envoiSMSService.sendSMSToContacts(clientId, message);
    res.json({ success: true, message: 'SMS sent to contacts successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  sendSMS,
  sendSMSToContacts
};
