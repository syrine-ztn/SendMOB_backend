const initModels = require('./../../../../models/init-models');
const sequelize = require('./../../../../db');
const LoggingService = require('../../../services/logging/logging');
const smpp = require('smpp');
const axios = require('axios');

const models = initModels(sequelize);
const clients = models['clients'];
const messages = models['messages'];
const contacts = models['contacts'];
const message_client_contact = models['message_client_contacts'];
const contact_message_client = models['contact_message_client'];


const SMPP_SERVER_URL = 'smpp://smpp-server-url:port'; // Remplacer par l'URL du serveur SMPP
const SMPP_PORT = 2776; // Remplacer par le port du serveur SMPP
const SESSION_TIMEOUT = 30000; // Timeout en millisecondes pour la session enquire link (30 secondes)


class EnvoiSMSService2 {
  constructor(loggingService) {
    this.loggingService = loggingService;
    this.sessions = {}; // Map pour stocker les sessions SMPP par client
  }

  async getClientSession(clientId) {
    // Vérifier si une session existe déjà pour le client
    if (!this.sessions[clientId]) {
      // Si aucune session n'existe, en créer une nouvelle
      this.sessions[clientId] = smpp.connect(`${SMPP_SERVER_URL}:${SMPP_PORT}`, {
        auto_enquire_link_period: SESSION_TIMEOUT
      });
      await this.sessions[clientId].bind_transceiver({
        system_id: 'system-id', // Remplacer "system-id" par l'identifiant système fourni par le fournisseur SMPP
        password: 'password' // Remplacer "password" par le mot de passe fourni par le fournisseur SMPP
      });
    }
    // Retourner la session pour le client
    return this.sessions[clientId];
  }

  async sendSMS(recipientPhoneNumber, message, clientId) {
    try {

      /*
        
        // Récupérer la session du client
        const session = await this.getClientSession(clientId);
        
        // Générer le PDU pour l'envoi de SMS
        const pdu = new smpp.PDU('submit_sm');
        pdu.destination_addr = recipientPhoneNumber;
        pdu.short_message = Buffer.from(message, 'utf-8');
        
        // Envoyer le PDU
        const response = await session.send(pdu);

        // Attendre la réponse de l'accusé de réception
        const ackPDU = await new Promise((resolve, reject) => {
          session.on('deliver_sm_resp', (pdu) => {
            resolve(pdu);
          });
          session.on('error', (error) => {
            reject(error);
          });
        });

        // Interpréter l'accusé de réception
        if (ackPDU.command_status === 0) {
          // Succès de la livraison du message
          return { success: true, message: 'SMS sent successfully' };
        } else {
          // Échec de la livraison du message
          throw new Error('Failed to send SMS: ' + ackPDU.message);
        }
       } catch (error) {
        throw new Error('Failed to send SMS: ' + error.message);
       }

      */

       
      // Récupérer le numéro de téléphone du client

      const client = await clients.findOne({
        where: { client_id: clientId },
        attributes: ['phone_number', 'corporation_name']
      });
  
      if (!client) {
        throw new Error('Client not found');
      }

    
      // Concaténer le nom de l'entreprise avec le message
      const messageWithCompany = `De : ${client.corporation_name}\n${message}`;


      const smsPayload = {
        to: recipientPhoneNumber, // Numéro de téléphone du client
        message: messageWithCompany, // Message à envoyer
      };
  
      // Envoyer la requête POST à l'API Traccar SMS avec le corps de la requête et l'en-tête d'autorisation
      const response = await axios.post('https://www.traccar.org/sms', smsPayload, {
        headers: {
          Authorization: 'fnKbNwrUR-aB54TdZXAFvL:APA91bHFe-NrxglQT_C8TaW2NvQC-G7r91SExXF2hyTmE0FvO7dH2waJaZ_11dnkigf1go1KB_xZbCLWLh5pcpYXBXL3yn2MWdRQtQ-F1uLSiOhZHArTACLaD8KjOGB6RM2sUSkry3Ky' // Remplacez <votre_token> par votre jeton d'authentification
        }
      });
  
      // Vérifier la réponse de l'API Traccar SMS
      if (response.status === 200) {
        return { success: true, message: 'SMS sent successfully' };
      } else {
        throw new Error('Failed to send SMS: ' + response.statusText);
      }
    } catch (error) {
      throw new Error('Failed to send SMS: ' + error.message);
    }
  }

  async sendSMSPwd(recipientPhoneNumber, message) {
    try {
    
      // Concaténer le nom de l'entreprise avec le message
      const messageWithCompany = `De : L'équipe de support de Mobilis\n${message}`;


      const smsPayload = {
        to: recipientPhoneNumber, // Numéro de téléphone du client
        message: messageWithCompany, // Message à envoyer
      };
  
      // Envoyer la requête POST à l'API Traccar SMS avec le corps de la requête et l'en-tête d'autorisation
      const response = await axios.post('https://www.traccar.org/sms', smsPayload, {
        headers: {
          Authorization: 'fnKbNwrUR-aB54TdZXAFvL:APA91bHFe-NrxglQT_C8TaW2NvQC-G7r91SExXF2hyTmE0FvO7dH2waJaZ_11dnkigf1go1KB_xZbCLWLh5pcpYXBXL3yn2MWdRQtQ-F1uLSiOhZHArTACLaD8KjOGB6RM2sUSkry3Ky' // Remplacez <votre_token> par votre jeton d'authentification
        }
      });
  
      // Vérifier la réponse de l'API Traccar SMS
      if (response.status === 200) {
        return { success: true, message: 'SMS sent successfully' };
      } else {
        throw new Error('Failed to send SMS: ' + response.statusText);
      }
    } catch (error) {
      throw new Error('Failed to send SMS: ' + error.message);
    }
  }


  async sendSMSToContacts(clientId, message) {
    try {
      // Récupérer les numéros de téléphone des contacts du client
      const clientContacts = await contacts.findAll({ where: { client_id: clientId } });
  
      // Envoyer un SMS à chaque contact et insérer les données nécessaires dans les tables
      const promises = clientContacts.map(async (contact) => {
        try {
          // Envoyer le SMS
          await this.sendSMS(contact.numero_telephone, message, clientId);
  
          // Créer un enregistrement de message dans la base de données
          const messageRecord = await messages.create({
            client_id: clientId,
            entete: message,
            heure_envoi: new Date(),
            date_envoi: new Date(),
            status: 'réussi'
          });
  
          // Insérer dans la table message_client_contact
          await message_client_contact.create({
            message_id: messageRecord.sms_id,
            client_id: clientId
          });
  
          // Insérer dans la table contact_message_client
          await contact_message_client.create({
            message_id: messageRecord.sms_id,
            contact_id: contact.contact_id
          });
  
        } catch (error) {
          // En cas d'échec, enregistrer les erreurs de l'envoi de SMS avec un statut échoué
          const failedMessageRecord = await messages.create({
            client_id: clientId,
            entete: message,
            heure_envoi: new Date(),
            date_envoi: new Date(),
            status: 'échoué'
          });
  
          // Insérer dans la table message_client_contact même pour les échecs
          await models['message_client_contact'].create({
            message_id: failedMessageRecord.sms_id,
            client_id: clientId
          });
        }
      });
  
      // Attendre que tous les SMS soient envoyés et les enregistrements créés
      await Promise.all(promises);
      return { success: true, message: 'SMS sent to contacts successfully' };
    } catch (error) {
      throw new Error('Failed to send SMS to contacts: ' + error.message);
    }
  }
  
  async sendSMSToSelectedContacts(clientId, message,clientContacts) {
    try {

      // Envoyer un SMS à chaque contact et insérer les données nécessaires dans les tables
      const promises = clientContacts.map(async (contact) => {
        try {
          // Envoyer le SMS
          await this.sendSMS(contact.numero_telephone, message, clientId);
  
          // Créer un enregistrement de message dans la base de données
          const messageRecord = await messages.create({
            client_id: clientId,
            entete: message,
            heure_envoi: new Date(),
            date_envoi: new Date(),
            status: 'réussi'
          });
  
          // Insérer dans la table message_client_contact
          await message_client_contact.create({
            message_id: messageRecord.sms_id,
            client_id: clientId
          });
  
          // Insérer dans la table contact_message_client
          await contact_message_client.create({
            message_id: messageRecord.sms_id,
            contact_id: contact.contact_id
          });
  
        } catch (error) {
          // En cas d'échec, enregistrer les erreurs de l'envoi de SMS avec un statut échoué
          const failedMessageRecord = await messages.create({
            client_id: clientId,
            entete: message,
            heure_envoi: new Date(),
            date_envoi: new Date(),
            status: 'échoué'
          });
  
          // Insérer dans la table message_client_contact même pour les échecs
          await models['message_client_contact'].create({
            message_id: failedMessageRecord.sms_id,
            client_id: clientId
          });
        }
      });
  
      // Attendre que tous les SMS soient envoyés et les enregistrements créés
      await Promise.all(promises);
      return { success: true, message: 'SMS sent to contacts successfully' };
    } catch (error) {
      throw new Error('Failed to send SMS to contacts: ' + error.message);
    }
  }
  
}

module.exports = EnvoiSMSService2;
