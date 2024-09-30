const initModels = require('./../../../../models/init-models');
const sequelize = require('./../../../../db');
const LoggingService = require('../../../services/logging/logging');
const twilio = require('twilio');

const models = initModels(sequelize);
const clients = models['clients'];
const messages = models['messages'];
const contacts = models['contacts'];

const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const senderPhoneNumber = '+17817377844';

class EnvoiSMSService {
  constructor(loggingService) {
    this.loggingService = loggingService;
    this.client = twilio(accountSid, authToken);
  }

  async sendSMS(recipientPhoneNumber, message) {
    try {
      const sentMessage = await this.client.messages.create({
        body: message,
        from: senderPhoneNumber,
        to: recipientPhoneNumber
      });
      return sentMessage;
    } catch (error) {
      //this.loggingService.logError('Failed to send SMS: ' + error.message);
      throw new Error('Failed to send SMS: ' + error.message);
    }
  }

  
  async sendSMSToContacts(clientId, message) {
    try {
      // Récupérer les numéros de téléphone des contacts du client
      const clientContacts = await contacts.findAll({ where: { client_id: clientId } });
      
      // Envoyer un SMS à chaque contact
      const promises = clientContacts.map(async (contact) => {
        try {
          await this.sendSMS(contact.numero_telephone, message);
          // Enregistrer le message dans la base de données
          await messages.create({
            client_id: clientId,
            entete: message,
            heure_envoi: new Date(),
            date_envoi: new Date(),
            status: SMS_STATUS_SUCCESS
          });
        } catch (error) {
          // Enregistrer les erreurs de l'envoi de SMS
          await messages.create({
            client_id: clientId,
            entete: message,
            heure_envoi: new Date(),
            date_envoi: new Date(),
            status: SMS_STATUS_FAILED
          });
        }
      });

      await Promise.all(promises);
    } catch (error) {
      //this.loggingService.logError('Failed to send SMS to contacts: ' + error.message);
      throw new Error('Failed to send SMS to contacts: ' + error.message);
    }
  }
}

module.exports = EnvoiSMSService;
