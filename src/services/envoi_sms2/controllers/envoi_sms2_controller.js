const EnvoiSMSService2 = require('./../service/envoi_sms2_service');

const envoiSMSService = new EnvoiSMSService2();

async function sendSMS(req, res) {
  const { recipientPhoneNumber, message, clientId } = req.body; // Ajoutez clientId à la requête
  try {
    const sentMessage = await envoiSMSService.sendSMS(recipientPhoneNumber, message, clientId); // Ajoutez clientId
    res.json({ success: true, message: 'SMS sent successfully', data: sentMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function sendSMSPwd(req, res) {
  const { recipientPhoneNumber, message } = req.body; 
  try {
    const sentMessage = await envoiSMSService.sendSMSPwd(recipientPhoneNumber, message);
    res.json({ success: true, message: 'SMS sent successfully', data: sentMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function sendSMSToContacts(req, res) {
  const clientId = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  const { message } = req.body;
  try {
    await envoiSMSService.sendSMSToContacts(clientId, message);
    res.json({ success: true, message: 'SMS sent to contacts successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function sendSMSToSelectedContacts(req, res) {
  const clientId = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  const { message,contacts } = req.body;
  try {
    await envoiSMSService.sendSMSToSelectedContacts(clientId, message,contacts);
    res.json({ success: true, message: 'SMS sent to contacts successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  sendSMS,
  sendSMSToContacts,
  sendSMSToSelectedContacts,
  sendSMSPwd
};
