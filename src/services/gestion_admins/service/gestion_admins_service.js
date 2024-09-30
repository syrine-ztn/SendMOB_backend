const initModels = require("./../../../../models/init-models");
const sequelize = require("./../../../../db");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const LoggingService = require('../../../services/logging/logging'); // Import the logging service

const models = initModels(sequelize);
const admins = models["admins"];
const moderateurs = models["moderateurs"];

class GestionAdminsService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionAdminsService
  }

  async getAdminById(Id) {
    try {
      const admin = await admins.findByPk(Id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {

      await this.loggingService.log(`Failed to fetch admin with ID ${Id}: ${error.message}`);
      throw new Error('Failed to fetch admin');
    }
  }

  async updateAdmin(adminId, adminData) {
    try {
      // Check if adminData contains a password that needs to be updated
      if (adminData.password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
        adminData.password = hashedPassword; // Replace the plain password with the hashed one
      }

      // Proceed with updating the admin record
      const updatedAdmin = await admins.update(adminData, {
        where: { admin_id: adminId },
      });

      // Log the admin update
      await this.loggingService.log(`Admin with ID ${adminId} updated successfully.`);

      return updatedAdmin;
    } catch (error) {
      // Log the error if the update fails
      await this.loggingService.log(`Failed to update admin with ID ${adminId}: ${error.message}`);
      throw new Error("Failed to update admin: " + error.message);
    }
  }



  async updateAdminPwd(adminData) {
    try {
      // Check if adminData contains a password that needs to be updated
      if (adminData.password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
        adminData.password = hashedPassword; // Replace the plain password with the hashed one
      }

      // Proceed with updating the admin record
      const updatedAdmin = await admins.update(adminData, {
        where: { email: adminData.email },
      });

      // Log the admin update
      await this.loggingService.log(`Admin updated successfully.`);

      return updatedAdmin;
    } catch (error) {
      // Log the error if the update fails
      await this.loggingService.log(`Failed to update admin ${error.message}`);
      throw new Error("Failed to update admin: " + error.message);
    }
  }


  async getModerateurById(Id) {
    try {
      const moderateur = await moderateurs.findByPk(Id);
      if (!moderateur) {
        throw new Error('Moderateurs not found');
      }
      return moderateur;
    } catch (error) {

      await this.loggingService.log(`Failed to fetch moderateur with ID ${Id}: ${error.message}`);
      throw new Error('Failed to fetch moderateur');
    }
  }

  async updateModerateur(moderateurId, moderateurData) {
    try {
      // Check if moderateurData contains a password that needs to be updated
      if (moderateurData.password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(moderateurData.password, saltRounds);
        moderateurData.password = hashedPassword; // Replace the plain password with the hashed one
      }

      // Proceed with updating the admin record
      const updatedModerateur = await moderateurs.update(moderateurData, {
        where: { mod_id: moderateurId },
      });

      // Log the moderateur update
      await this.loggingService.log(`Moderateur with ID ${moderateurId} updated successfully.`);

      return updatedModerateur;
    } catch (error) {
      // Log the error if the update fails
      await this.loggingService.log(`Failed to update moderateur with ID ${moderateurId}: ${error.message}`);
      throw new Error("Failed to update moderateur: " + error.message);
    }
  }

  async updateModerateurPwd(Data) {
    try {
      // Check if Data contains a password that needs to be updated
      if (Data.password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(Data.password, saltRounds);
        Data.password = hashedPassword; // Replace the plain password with the hashed one
      }

      // Proceed with updating the record
      const updated = await moderateurs.update(Data, {
        where: { email: Data.email },
      });

      // Log
      await this.loggingService.log(`Moderateur updated successfully.`);

      return updated;
    } catch (error) {
      // Log the error if the update fails
      await this.loggingService.log(`Failed to update moderateur ${error.message}`);
      throw new Error("Failed to update moderateur: " + error.message);
    }
  }

}

module.exports = new GestionAdminsService(new LoggingService()); // Pass an instance of LoggingService to GestionAdminsService
