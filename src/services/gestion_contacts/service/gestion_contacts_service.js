const initModels = require("../../../../models/init-models");
const sequelize = require("../../../../db");
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const contacts = models["contacts"];

class GestionContactsService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionContactsService
  }

  async getAllContacts(page) {
    try {
      if (isNaN(page) || page < 1) {
      const allContacts = await contacts.findAll();
      return allContacts;
      } else {
       // Si le paramètre page est défini, calculer le limit et l'offset
       const limit = 10; // Nombre d'éléments par page
       const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
       const allContacts = await contacts.findAll(limit, offset);
       return allContacts;
      }
    } catch (error) {
      // Log the error if fetching contacts fails
      await this.loggingService.log(`Failed to fetch contacts: ${error.message}`);
      throw new Error("Failed to fetch contacts");
    }
  }

  async getContactById(contactId) {
    try {
      const contact = await contacts.findByPk(contactId);
      if (!contact) {
        throw new Error("Contact not found");
      }
      return contact;
    } catch (error) {
      // Log the error if fetching a specific contact fails
      await this.loggingService.log(`Failed to fetch contact with ID ${contactId}: ${error.message}`);
      throw new Error("Failed to fetch contact");
    }
  }

  async createContact(contactData) {
    try {
      const contact = await contacts.create(contactData);
      return contact;
    } catch (error) {
      // Log the error if creating contact fails
      await this.loggingService.log(`Failed to create contact: ${error.message}`);
      throw new Error("Failed to create contact");
    }
  }

  async deleteContact(contactId) {
    try {
      const deletedContact = await contacts.destroy({
        where: { contact_id: contactId },
      });
      return deletedContact;
    } catch (error) {
      // Log the error if deleting contact fails
      await this.loggingService.log(`Failed to delete contact with ID ${contactId}: ${error.message}`);
      throw new Error("Failed to delete contact");
    }
  }

  async getAllContactsForClient(userId,page) {
    try {
      if (isNaN(page) || page < 1) {
      const allContacts = await contacts.findAll({where: { client_id: userId }});
      return allContacts;
     } else {
       // Si le paramètre page est défini, calculer le limit et l'offset
       const limit = 6; // Nombre d'éléments par page
       const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      const allContacts = await contacts.findAll({ limit, offset, where: { client_id: userId }});
      return allContacts;
     }
    } catch (error) {
      // Log the error if fetching contacts fails
      await this.loggingService.log(`Failed to fetch contacts: ${error.message}`);
      throw new Error("Failed to fetch contacts");
    }
  }

  async getAllContactsForClientPerLabel(userId,label,page) {
    try {
      if (isNaN(page) || page < 1) {
      const allContacts = await contacts.findAll({where: { client_id: userId, label: label}});
      return allContacts;
     } else {
       // Si le paramètre page est défini, calculer le limit et l'offset
       const limit = 10; // Nombre d'éléments par page
       const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      const allContacts = await contacts.findAll({ limit, offset, where: { client_id: userId, label: label }});
      return allContacts;
     }
    } catch (error) {
      // Log the error if fetching contacts fails
      await this.loggingService.log(`Failed to fetch contacts: ${error.message}`);
      throw new Error("Failed to fetch contacts");
    }
  }

}

module.exports = new GestionContactsService(new LoggingService());
