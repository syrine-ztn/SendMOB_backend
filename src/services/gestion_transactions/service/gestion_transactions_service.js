const initModels = require("../../../../models/init-models");
const sequelize = require("../../../../db");
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const transactions = models["transactions"];
const clients = models['clients'];
const plans = models['plans'];
const plans_clients = models['plans_clients'];

class GestionTransactionsService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionTransactionsService
  }

  async getAllTransactions() {
    try {
      const allTransactions = await transactions.findAll();
      return allTransactions;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch transactions: ${error.message}`);
      throw new Error("Failed to fetch transactions");
    }
  }

  async getTransactionById(transactionId) {
    try {
      const transaction = await transactions.findByPk(transactionId);
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch transaction with ID ${transactionId}: ${error.message}`);
      throw new Error("Failed to fetch transaction");
    }
  }

  async getAllTransactionsForClient(clientId,page) {
    try {
       // Récupérer le plan choisi par le client s'il en a un
       const plan = await plans_clients.findOne({ where: { client_id: clientId } });
       if (isNaN(page) || page < 1) {
      // Récupérer toutes les transactions du client spécifié, y compris le plan associé s'il existe
      const clientTransactions = await transactions.findAll({
        include: [
          {
            model: plans,
            as: 'plan',
            where: { plan_id: plan ? plan.plan_id : null } // Filtre les transactions uniquement avec le plan associé, s'il existe
          }
        ]
      });
      return clientTransactions;
    } else {
      // Si le paramètre page est défini, calculer le limit et l'offset
      const limit = 10; // Nombre d'éléments par page
      const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
      // Récupérer toutes les transactions du client spécifié, y compris le plan associé s'il existe
      const clientTransactions = await transactions.findAll({ limit, offset,
        include: [
          {
            model: plans,
            as: 'plan',
            where: { plan_id: plan ? plan.plan_id : null } // Filtre les transactions uniquement avec le plan associé, s'il existe
          }
        ]
      });
      return clientTransactions;
    }
    } catch (error) {
      await this.loggingService.log(`Failed to fetch transactions for client with id ${clientId}: ${error.message}`);
      throw new Error("Failed to fetch transaction for client");
    }
  }

  async createTransaction(transactionData) {
    try {
      const transaction = await transactions.create(transactionData);
      return transaction;
    } catch (error) {
      await this.loggingService.log(`Failed to create transaction: ${error.message}`);
      throw new Error("Failed to create transaction");
    }
  }
}

module.exports = new GestionTransactionsService(new LoggingService());
