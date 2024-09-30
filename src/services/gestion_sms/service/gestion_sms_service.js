const initModels = require("../../../../models/init-models");
const sequelize = require("../../../../db");
const LoggingService = require('../../logging/logging');

const models = initModels(sequelize);
const messages = models["messages"];
const clients = models["clients"];


class GestionSMSService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionSignalementsService
  }

  async getAllSMSs(page) {
    try {
      if (isNaN(page) || page < 1) {
        // Si le paramètre page n'est pas défini, appeler findAll() sans limit ni offset
        const allSMSs = await messages.findAll();
        return allSMSs;
      } else {
      // Si le paramètre page est défini, calculer le limit et l'offset
      const limit = 10; // Nombre d'éléments par page
      const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      const allSMSs = await messages.findAll({
        limit, offset,
        
      });
      return allSMSs;
      }
    } catch (error) {
      await this.loggingService.log(`Failed to fetch sms: ${error.message}`);
      throw new Error("Failed to fetch sms");
    }
  }

  async getSMSById(smsId) {
    try {
      const message = await messages.findByPk(smsId);
      if (!message) {
        throw new Error("SMS not found");
      }
      return message;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch sms with ID ${smsId}: ${error.message}`);
      throw new Error("Failed to fetch sms");
    }
  }

  async getSMSForClient(clientId,page) {
    try {
      if (isNaN(page) || page < 1) {
        // Si le paramètre page n'est pas défini, appeler findAll() sans limit ni offset
      
      
      const message = await messages.findAll({ where: { client_id: clientId }});

      if (!message) {
        throw new Error("SMS not found");
      }
      return message;
      } else {
        
      const limit = 8; // Nombre d'éléments par page
      const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
         
      
      const message = await messages.findAll({limit, offset, where: { client_id: clientId }});

      if (!message) {
        throw new Error("SMS not found");
      }
      return message;
      }
    } catch (error) {
      await this.loggingService.log(`Failed to fetch sms: ${error.message}`);
      throw new Error("Failed to fetch sms");
    }
  }


}

module.exports = new GestionSMSService(new LoggingService());
