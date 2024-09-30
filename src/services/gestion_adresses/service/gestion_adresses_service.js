const initModels = require("../../../../models/init-models");
const sequelize = require("../../../../db");
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const adresses = models["adresses"];

class GestionAdressesService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionAdressesService
  }

  async getAllAdressesForClient(userId,page) {
    try {
      if (isNaN(page) || page < 1) {
      const allAdresses = await adresses.findAll({where: { client_id: userId }});
      return allAdresses;
     } else {
       // Si le paramètre page est défini, calculer le limit et l'offset
       const limit = 10; // Nombre d'éléments par page
       const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      const allAdresses = await adresses.findAll({ limit, offset, where: { client_id: userId }});
      return allAdresses;
     }
    } catch (error) {
      // Log the error if fetching adresses fails
      await this.loggingService.log(`Failed to fetch adresses: ${error.message}`);
      throw new Error("Failed to fetch adresses");
    }
  }

  async getAdresseById(adresseId) {
    try {
      const adresse = await adresses.findByPk(adresseId);
      if (!adresse) {
        throw new Error("Adresse not found");
      }
      return adresse;
    } catch (error) {
      // Log the error if fetching a specific adresse fails
      await this.loggingService.log(`Failed to fetch adresse with ID ${adresseId}: ${error.message}`);
      throw new Error("Failed to fetch adresse");
    }
  }

  async createAdresse(adresseData) {
    try {
      const adresse = await adresses.create(adresseData);
      return adresse;
    } catch (error) {
      // Log the error if creating adresse fails
      await this.loggingService.log(`Failed to create adresse: ${error.message}`);
      throw new Error("Failed to create adresse");
    }
  }

  async deleteAdresse(adresseId) {
    try {
      const deletedAdresse = await adresses.destroy({
        where: { adresse_id: adresseId },
      });
      return deletedAdresse;
    } catch (error) {
      // Log the error if deleting adresse fails
      await this.loggingService.log(`Failed to delete adresse with ID ${adresseId}: ${error.message}`);
      throw new Error("Failed to delete adresse");
    }
  }

  async updateAdresse(adresseId, adresseData) {
    try {
      const updatedAdresse = await adresses.update(adresseData, {
        where: { adresse_id: adresseId },
      });
      return updatedAdresse;
    } catch (error) {
      // Log the error if updating adresse fails
      await this.loggingService.log(`Failed to update adresse with ID ${adresseId}: ${error.message}`);
      throw new Error("Failed to update adresse");
    }
  }
}

module.exports = new GestionAdressesService(new LoggingService());
