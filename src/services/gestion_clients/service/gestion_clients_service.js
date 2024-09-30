const initModels = require('./../../../../models/init-models');
const sequelize = require('./../../../../db');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const clients = models['clients'];
const moderateurs = models['moderateurs'];

class GestionClientsService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionClientsService
  }
  
  async getAllClients(page) {
    try {
      if (isNaN(page) || page < 1) {
        // Si le paramètre page n'est pas défini, appeler findAll() sans limit ni offset
        const allClients = await clients.findAll();
        return allClients;
      } else {
      const limit = 10; // Nombre d'éléments par page
      const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      const allClients = await clients.findAll({ limit, offset }); // Utiliser la pagination dans la requête SQL
      return allClients;
      }
    } catch (error) {
      // Log the error if fetching clients fails
      await this.loggingService.log(`Failed to fetch clients: ${error.message}`);
      throw new Error('Failed to fetch clients');
    }
  }

  async getClientById(clientId) {
    try {
      const client = await clients.findByPk(clientId);
      if (!client) {
        throw new Error('Client not found');
      }
      return client;
    } catch (error) {
      // Log the error if fetching a specific client fails
      await this.loggingService.log(`Failed to fetch client with ID ${clientId}: ${error.message}`);
      throw new Error('Failed to fetch client');
    }
  }

  async getClientForModerateur(moderateurId,page) {

      try {
        if (isNaN(page) || page < 1) {
          // Si le paramètre page n'est pas défini, appeler findAll() sans limit ni offset
          const allClients = await clients.findAll({ where: { mod_id: moderateurId } });
          return allClients;
        } else {
        const limit = 10; // Nombre d'éléments par page
        const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
        const allClients = await clients.findAll({ limit, offset, where: { mod_id: moderateurId } }); // Utiliser la pagination dans la requête SQL
        return allClients;
        }
      } catch (error) {
        // Log the error if fetching clients fails
        await this.loggingService.log(`Failed to fetch clients: ${error.message}`);
        throw new Error('Failed to fetch clients');
      }


  }

  async createClient(clientData) {
    try {
      // Check if there's a password and hash it
      if (clientData.password) {
        const hashedPassword = await bcrypt.hash(clientData.password, saltRounds);
        clientData.password = hashedPassword;
      }
  
      const client = await clients.create(clientData);
      return client;
    } catch (error) {
      // Log the error if creating client fails
      await this.loggingService.log(`Failed to create client: ${error.message}`);
      throw new Error('Failed to create client');
    }
  }

  async deleteClient(clientId) {
    try {
      const deletedClient = await clients.destroy({ where: { client_id: clientId } });
      return deletedClient;
    } catch (error) {
      // Log the error if deleting client fails
      await this.loggingService.log(`Failed to delete client with ID ${clientId}: ${error.message}`);
      throw new Error('Failed to delete client');
    }
  }

  async updateClient(clientId, clientData) {
    try {
      // Check if there's a password and hash it
      if (clientData.password) {
        const hashedPassword = await bcrypt.hash(clientData.password, saltRounds);
        clientData.password = hashedPassword;
      }
  
      const updatedClient = await clients.update(clientData, { where: { client_id: clientId } });
      return updatedClient;
    } catch (error) {
      // Log the error if updating client fails
      await this.loggingService.log(`Failed to update client with ID ${clientId}: ${error.message}`);
      throw new Error('Failed to update client');
    }
  }

  async updateProfileClient(clientId, clientData) {
    try {
      // Check if there's a password and hash it
      if (clientData.password) {
        const hashedPassword = await bcrypt.hash(clientData.password, saltRounds);
        clientData.password = hashedPassword;
      }
  
      const updatedClient = await clients.update(clientData, { where: { client_id: clientId } });
      return updatedClient;
    } catch (error) {
      // Log the error if updating client profile fails
      await this.loggingService.log(`Failed to update client profile with ID ${clientId}: ${error.message}`);
      throw new Error('Failed to update client profile');
    }
  }

  async blockClient(clientId) {
    try {
      const blockedClient = await clients.update({ status: 'Suspendu' }, { where: { client_id: clientId } });
      return blockedClient;
    } catch (error) {
      // Log the error if blocking client fails
      await this.loggingService.log(`Failed to block client with ID ${clientId}: ${error.message}`);
      throw new Error('Failed to block client');
    }
  }

  async debloquerClient(clientId) {
    try {
      const unblockedClient = await clients.update({ status: 'Actif' }, { where: { client_id: clientId } });
      return unblockedClient;
    } catch (error) {
      // Log the error if unblocking client fails
      await this.loggingService.log(`Failed to unblock client with ID ${clientId}: ${error.message}`);
      throw new Error('Failed to unblock client');
    }
  }
}

module.exports = new GestionClientsService(new LoggingService());
