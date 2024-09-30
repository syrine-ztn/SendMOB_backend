const initModels = require("./../../../../models/init-models");
const sequelize = require("./../../../../db");
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const moderateurs = models["moderateurs"];

class GestionModerateursService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionModerateursService
  }

  
  async getAllModerateurs(page, status) {
    try {
      if (isNaN(page) || page < 1) {
        // Si le paramètre page n'est pas défini, appeler findAll() sans limit ni offset
        if (status) {
          // Si un statut est spécifié, filtrer par ce statut
          const allModerateurs = await moderateurs.findAll({ where: { status_mod: status } });
          return allModerateurs;
        } else {
          // Sinon, retourner tous les modérateurs sans filtre de statut
          const allModerateurs = await moderateurs.findAll();
          return allModerateurs;
        }
      } else {
        // Si le paramètre page est défini, calculer le limit et l'offset
        const limit = 10; // Nombre d'éléments par page
        const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
        
        if (status) {
          // Si un statut est spécifié, filtrer par ce statut avec limit et offset
          const allModerateurs = await moderateurs.findAll({ where: { status_mod: status }, limit, offset });
          return allModerateurs;
        } else {
          // Sinon, retourner tous les modérateurs avec limit et offset
          const allModerateurs = await moderateurs.findAll({ limit, offset });
          return allModerateurs;
        }
      }
    } catch (error) {
      // Log the error if fetching moderateurs fails
      await this.loggingService.log(`Failed to fetch moderateurs: ${error.message}`);
      throw new Error("Failed to fetch moderateurs");
    }
  }
  
  

  async getModerateurById(moderateurId) {
    try {
      const moderateur = await moderateurs.findByPk(moderateurId);
      if (!moderateur) {
        throw new Error("Moderateur not found");
      }
      return moderateur;
    } catch (error) {
      // Log the error if fetching a specific moderateur fails
      await this.loggingService.log(`Failed to fetch moderateur with ID ${moderateurId}: ${error.message}`);
      throw new Error("Failed to fetch moderateur");
    }
  }

  async createModerateur(moderateurData) {
    try {
      // Hash password if it exists
      if (moderateurData.password) {
        const hashedPassword = await bcrypt.hash(moderateurData.password, saltRounds);
        moderateurData.password = hashedPassword;
      }
  
      const moderateur = await moderateurs.create(moderateurData);
      return moderateur;
    } catch (error) {
      // Log the error if creating moderateur fails
      await this.loggingService.log(`Failed to create moderateur: ${error.message}`);
      throw new Error("Failed to create moderateur");
    }
  }
  

  async deleteModerateur(moderateurId) {
    try {
      const deletedModerateur = await moderateurs.destroy({
        where: { mod_id: moderateurId },
      });
      return deletedModerateur;
    } catch (error) {
      // Log the error if deleting moderateur fails
      await this.loggingService.log(`Failed to delete moderateur with ID ${moderateurId}: ${error.message}`);
      throw new Error("Failed to delete moderateur");
    }
  }

  async updateModerateur(moderateurId, moderateurData) {
    try {
      // Hash password if it exists
      if (moderateurData.password) {
        const hashedPassword = await bcrypt.hash(moderateurData.password, saltRounds);
        moderateurData.password = hashedPassword;
      }
  
      const updatedModerateur = await moderateurs.update(moderateurData, {
        where: { mod_id: moderateurId },
      });
      return updatedModerateur;
    } catch (error) {
      // Log the error if updating moderateur fails
      await this.loggingService.log(`Failed to update moderateur with ID ${moderateurId}: ${error.message}`);
      throw new Error("Failed to update moderateur");
    }
  }

  async updateProfileModerateur(moderateurId, moderateurData) {
    try {
      // Hash password if it exists
      if (moderateurData.password) {
        const hashedPassword = await bcrypt.hash(moderateurData.password, saltRounds);
        moderateurData.password = hashedPassword;
      }
  
      const updatedModerateur = await moderateurs.update(moderateurData, {
        where: { mod_id: moderateurId },
      });
      return updatedModerateur;
    } catch (error) {
      // Log the error if updating moderateur fails
      await this.loggingService.log(`Failed to update moderateur with ID ${moderateurId}: ${error.message}`);
      throw new Error("Failed to update moderateur");
    }
  }
  

  async blockModerateur(moderateurId) {
    try {
      const blockedModerateur = await moderateurs.update(
        { status_mod: "Suspendu" },
        { where: { mod_id: moderateurId } }
      );
      return blockedModerateur;
    } catch (error) {
      // Log the error if blocking moderateur fails
      await this.loggingService.log(`Failed to block moderateur with ID ${moderateurId}: ${error.message}`);
      throw new Error("Failed to block moderateur");
    }
  }

  async debloquerModerateur(moderateurId) {
    try {
      const unblockedModerateur = await moderateurs.update(
        { status_mod: "Actif" },
        { where: { mod_id: moderateurId } }
      );
      return unblockedModerateur;
    } catch (error) {
      // Log the error if unblocking moderateur fails
      await this.loggingService.log(`Failed to unblock moderateur with ID ${moderateurId}: ${error.message}`);
      throw new Error("Failed to unblock moderateur");
    }
  }
}

module.exports = new GestionModerateursService(new LoggingService());
