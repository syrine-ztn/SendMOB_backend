const initModels = require("./../../../../models/init-models");
const sequelize = require("./../../../../db");
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const plans = models["plans"];
const plans_clients = models["plans_clients"];
const clients = models["clients"];
const moderateurs = models["moderateurs"];

class GestionPlansService {
  constructor(loggingService) {
    this.loggingService = loggingService; // Inject the logging service into the GestionPlansService
  }

  async getAllPlans(page) {
    try {
      if (isNaN(page) || page < 1) {
      const allPlans = await plans.findAll({
        include: [
          {
            model: plans_clients,
            as: 'plans_clients',
            attributes: ['client_id'],
            include: {
              model: clients,
              as: 'client',
              attributes: ['corporation_name'],
            },
          },
        ],
      });
      return allPlans; } else {
       // Si le paramètre page est défini, calculer le limit et l'offset
       const limit = 10; // Nombre d'éléments par page
       const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
       const allPlans = await plans.findAll({
        limit, offset,
        include: [
          {
            model: plans_clients,
            as: 'plans_clients',
            attributes: ['client_id'],
            include: {
              model: clients,
              as: 'client',
              attributes: ['corporation_name'],
            },
          },
        ],
      });
      return allPlans; 
      }
    } catch (error) {
      // Log the error if fetching plans fails
      await this.loggingService.log(`Failed to fetch plans: ${error.message}`);
      throw new Error("Failed to fetch plans");
    }
  }

  async getAllPlansForModerateur(id,page) {
    try {
      if (isNaN(page) || page < 1) {

         // Récupérer les informations des clients du modérateur
      const client = await clients.findAll({ 
        where: { mod_id: id },
        attributes: ['client_id']
      });
      
      if (client.length === 0) {
        throw new Error('Clients not found for the given moderator');
      }
  
      const clientIds = client.map(client => client.client_id);

      // Récupérer les plans choisis par les clients
      const plansClients = await plans_clients.findAll({ 
        where: { client_id: clientIds }
      });
  
      const planIds = plansClients.map(pc => pc.plan_id);


      const allPlans = await plans.findAll({
        include: [
          {
            model: plans_clients,
            as: 'plans_clients',
            attributes: ['client_id'],
            where: { plan_id: planIds },
            include: {
              model: clients,
              as: 'client',
              attributes: ['corporation_name'],
            },
          },
        ],
      });
      return allPlans; } else {

      // Récupérer les informations des clients du modérateur
      const client = await clients.findAll({ 
        where: { mod_id: id },
        attributes: ['client_id']
      });
      
      if (client.length === 0) {
        throw new Error('Clients not found for the given moderator');
      }
  
      const clientIds = client.map(client => client.client_id);

      // Récupérer les plans choisis par les clients
      const plansClients = await plans_clients.findAll({ 
        where: { client_id: clientIds }
      });
  
      const planIds = plansClients.map(pc => pc.plan_id);

       // Si le paramètre page est défini, calculer le limit et l'offset
       const limit = 10; // Nombre d'éléments par page
       const offset = (page - 1) * limit; // Calculer le décalage en fonction du numéro de la page
       const allPlans = await plans.findAll({
        limit, offset,
        include: [
          {
            model: plans_clients,
            as: 'plans_clients',
            attributes: ['client_id'],
            where: { plan_id: planIds },
            include: {
              model: clients,
              as: 'client',
              attributes: ['corporation_name'],
            },
          },
        ],
      });
      return allPlans; 
      }
    } catch (error) {
      // Log the error if fetching plans fails
      await this.loggingService.log(`Failed to fetch plans: ${error.message}`);
      throw new Error("Failed to fetch plans");
    }
  }

  async getPlanById(planId) {
    try {
      const plan = await plans.findByPk(planId, {
        include: [
          {
            model: plans_clients,
            as: 'plans_clients',
            include: {
              model: clients,
              as: 'client',
              attributes: ['client_id', 'corporation_name'],
            },
          },
        ],
      });
      if (!plan) {
        throw new Error("Plan not found with the specified ID.");
      }
      return plan;
    } catch (error) {
      // Log the error if fetching a specific plan fails
      await this.loggingService.log(`Failed to fetch plan with ID ${planId}: ${error.message}`);
      throw new Error("Failed to fetch plan");
    }
  }

  async getPlanByclientId(clientId) {
    try {

      const plans_client = await plans_clients.findOne({where: { client_id: clientId }});

      if (!plans_client) {
        throw new Error("Plan not found.");
      }
      return plans_client;
    } catch (error) {
      // Log the error if fetching a specific plan fails
      await this.loggingService.log(`Failed to fetch plan: ${error.message}`);
      throw new Error("Failed to fetch plan");
    }
  }

  async getPlanForClient(moderateurId) {
    try {
      const moderateur = await moderateurs.findOne({ where: { mod_id: moderateurId },
        attributes: ['client_id'] });
      const plans_client = await plans_clients.findOne({ where: { client_id: moderateur.client_id },attributes: ['plan_id'] });

      const plan = await plans.findOne({ where: { plan_id: plans_client.plan_id }});
      if (!plan) {
        throw new Error("Plan not found.");
      }
      return plan;
    } catch (error) {
      // Log the error if fetching a specific plan fails
      await this.loggingService.log(`Failed to fetch plan : ${error.message}`);
      throw new Error("Failed to fetch plan");
    }
  }

  async createPlan(planData) {
    try {
      const createdPlan = await plans.create(planData);

      if (planData.client_id) {
        await plans_clients.create({
          plan_id: createdPlan.plan_id,
          client_id: planData.client_id,
        });
      }

      return createdPlan;
    } catch (error) {
      await this.loggingService.log(`Error creating the plan: ${error.message}`);
      throw new Error("Error creating the plan");
    }
  }

  async updatePlan(planId, updatedPlanData) {
    try {
      const planToUpdate = await plans.findByPk(planId);
      if (!planToUpdate) {
        throw new Error("Plan not found with the specified ID.");
      }

      await planToUpdate.update(updatedPlanData);

      if (updatedPlanData.client_id) {
        await plans_clients.destroy({ where: { plan_id: planId } });
        await plans_clients.create({
          plan_id: planId,
          client_id: updatedPlanData.client_id,
        });
      }

      return await this.getPlanById(planId);
    } catch (error) {
      await this.loggingService.log(`Error updating the plan: ${error.message}`);
      throw new Error("Error updating the plan");
    }
  }
}

module.exports = new GestionPlansService(new LoggingService());
