const initModels = require("../../../../models/init-models");
const sequelize = require("../../../../db");
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const signalements = models["signalements"];
const clients = models["clients"];
const moderateurs = models["moderateurs"];


class GestionSignalementsService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionSignalementsService
  }

  async getAllSignalements(page) {
    try {
      if (isNaN(page) || page < 1) {
        // Si le paramètre page n'est pas défini, appeler findAll() sans limit ni offset
        const allSignalements = await signalements.findAll({
          include: [{
            model: clients,
            as:'client',
            attributes: ['corporation_name'], // Inclure seulement le nom de l'entreprise du client
            required: true // Assurez-vous que la jointure est une jointure interne
          }]
        });
        return allSignalements;
      } else {
      // Si le paramètre page est défini, calculer le limit et l'offset
      const limit = 10; // Nombre d'éléments par page
      const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      const allSignalements = await signalements.findAll({
        limit, offset,
        include: [{
          model: clients,
          as:'client',
          attributes: ['corporation_name'], // Inclure seulement le nom de l'entreprise du client
          required: true // Assurez-vous que la jointure est une jointure interne
        }]
      });
      return allSignalements;
      }
    } catch (error) {
      await this.loggingService.log(`Failed to fetch signalements: ${error.message}`);
      throw new Error("Failed to fetch signalements");
    }
  }

  async getSignalementById(signalementId) {
    try {
      const signalement = await signalements.findByPk(signalementId);
      if (!signalement) {
        throw new Error("Signalement not found");
      }
      return signalement;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch signalement with ID ${signalementId}: ${error.message}`);
      throw new Error("Failed to fetch signalement");
    }
  }

  async getSignalementForClient(moderateurId,page) {
    try {
      if (isNaN(page) || page < 1) {

        // Récupérer les informations des clients du modérateur
        const client = await clients.findAll({ 
          where: { mod_id: moderateurId },
          attributes: ['client_id']
        });
        
        if (client.length === 0) {
          throw new Error('Clients not found for the given moderator');
        }
    
        const clientIds = client.map(client => client.client_id);


      const signalement = await signalements.findAll({   include: [{
        model: clients,
        as:'client',
        attributes: ['corporation_name'], // Inclure seulement le nom de l'entreprise du client
        required: true // Assurez-vous que la jointure est une jointure interne
      }], where: { client_id: clientIds }});

      if (!signalement) {
        throw new Error("Signalement not found");
      }
      return signalement;
      } else {
        
      const limit = 10; // Nombre d'éléments par page
      const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
         
       // Récupérer les informations des clients du modérateur
       const client = await clients.findAll({ 
        where: { mod_id: moderateurId },
        attributes: ['client_id']
      });
      
      if (client.length === 0) {
        throw new Error('Clients not found for the given moderator');
      }
  
      const clientIds = client.map(client => client.client_id);
      
      const signalement = await signalements.findAll({limit, offset,   include: [{
        model: clients,
        as:'client',
        attributes: ['corporation_name'], // Inclure seulement le nom de l'entreprise du client
        required: true // Assurez-vous que la jointure est une jointure interne
      }], where: { client_id: clientIds }});

      if (!signalement) {
        throw new Error("Signalement not found");
      }
      return signalement;
      }
    } catch (error) {
      await this.loggingService.log(`Failed to fetch signalement: ${error.message}`);
      throw new Error("Failed to fetch signalement");
    }
  }

  async createSignalement(signalementData) {
    try {
      const signalement = await signalements.create(signalementData);
      return signalement;
    } catch (error) {
      await this.loggingService.log(`Failed to create signalement: ${error.message}`);
      throw new Error("Failed to create signalement");
    }
  }

  async getSignalementsOfClient(clientId,page) {
    try {
      if (isNaN(page) || page < 1) {
      // Si le paramètre page n'est pas défini, appeler findAll() sans limit ni offset
      
      const signalement = await signalements.findAll({ where: { client_id: clientId }});

      if (!signalement) {
        throw new Error("Signalement not found");
      }
      return signalement;
      } else {
        
      const limit = 7; // Nombre d'éléments par page
      const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      
      const signalement = await signalements.findAll({limit, offset, where: { client_id: clientId }});

      if (!signalement) {
        throw new Error("Signalement not found");
      }
      return signalement;
      }
    } catch (error) {
      await this.loggingService.log(`Failed to fetch signalement: ${error.message}`);
      throw new Error("Failed to fetch signalement");
    }
  }

  async updateSignalement(SignalementId, Data) {
    try {
  
      const updated = await signalements.update(Data, { where: { signalement_id: SignalementId } });
      return updated;
    } catch (error) {
      // Log the error if updating fails
      await this.loggingService.log(`Failed to update signalement with ID ${SignalementId}: ${error.message}`);
      throw new Error('Failed to update signalement');
    }
  }

}

module.exports = new GestionSignalementsService(new LoggingService());
