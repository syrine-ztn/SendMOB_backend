const initModels = require('./../../../../models/init-models');
const sequelize = require('./../../../../db');
const PDFDocument = require('pdfkit');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const { Op } = require('sequelize');
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const clients = models['clients'];
const moderateurs = models['moderateurs'];
const plans = models['plans'];
const messages = models['messages'];
const plans_clients = models['plans_clients'];
const transaction = models['transactions'];

const TRANSACTION_STATUS_PAID = 'payé';
const TRANSACTION_STATUS_SUSPENDED = 'Suspendu';

// Constantes pour les états des SMS
const SMS_STATUS_SUCCESS = 'réussi';
const SMS_STATUS_FAILED = 'échoué';

class StatistiquesService {
  constructor(loggingService) {
    this.loggingService = loggingService;
  }

  async getClientDashboard(clientId) {
    try {
      // Récupérer les informations du client
      const client = await clients.findByPk(clientId);
      if (!client) {
        throw new Error('Client not found');
      }
  
      // Récupérer le plan choisi par le client s'il en a un
      const plan = await plans_clients.findOne({ where: { client_id: clientId } });
      let planDetails = null;
      if (plan) {
        planDetails = await plans.findByPk(plan.plan_id);
      }
  
      // Récupérer la dernière transaction payée pour ce plan
      const lastPaidTransaction = await transaction.findOne({
        where: {
          plan_id: plan ? plan.plan_id : null,
          status_transaction: 'payé'
        },
        order: [['date_paiement', 'DESC']]
      });
  
      let remainingSMS = 0;
      let smsUtilises = 0;
      let expirationDate = null;
      if (planDetails && lastPaidTransaction) {
        // Calculer la date d'expiration du plan basée sur la durée et la date de paiement de la dernière transaction
        expirationDate = new Date(lastPaidTransaction.date_paiement);
        expirationDate.setMonth(expirationDate.getMonth() + planDetails.duree);
  
        // Vérifier si la transaction est encore valide par rapport à la durée du plan
        if (expirationDate > new Date()) {
          const messagesSinceLastPaid = await messages.count({
            where: {
              client_id: clientId,
              date_envoi: { [Op.gte]: lastPaidTransaction.date_paiement }
            }
          });
          smsUtilises = messagesSinceLastPaid;
          remainingSMS = planDetails.nombre_message - messagesSinceLastPaid;
        }
      }
  
      // Assembler les données du dashboard client
      const clientDashboard = {
        planChoisi: planDetails ? planDetails.nom_plan : 'Aucun',
        tempsRestant: planDetails ? (expirationDate && expirationDate > new Date() ? Math.round((expirationDate - new Date()) / (1000 * 60 * 60 * 24)) : 0) : null,
        totalSMS: planDetails ? planDetails.nombre_message : null,
        smsUtilises: smsUtilises,
        smsRestants: remainingSMS,
      };
  
      await this.loggingService.log(`Fetched dashboard for client ${clientId}`);
  
      return clientDashboard;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch client dashboard: ${error.message}`);
      throw new Error('Failed to fetch client dashboard');
    }
  }
  
  

  async getModerateurDashboard(moderateurId) {
    try {
      // Récupérer les informations des clients du modérateur
      const client = await clients.findAll({ 
        where: { mod_id: moderateurId },
        attributes: ['client_id']
      });
      
      if (client.length === 0) {
        throw new Error('Clients not found for the given moderator');
      }
  
      const clientIds = client.map(client => client.client_id);
  
      // Récupérer le total des clients
      const totalClients = await clients.count({ where: { mod_id: moderateurId } });
  
      // Récupérer le total des SMS réussis et échoués
      const totalSuccessfulSMS = await messages.count({ 
        where: { 
          client_id: clientIds, 
          status: SMS_STATUS_SUCCESS 
        } 
      });
      
      const totalFailedSMS = await messages.count({ 
        where: { 
          client_id: clientIds, 
          status: SMS_STATUS_FAILED 
        } 
      });
  
      // Récupérer les plans choisis par les clients
      const plansClients = await plans_clients.findAll({ 
        where: { client_id: clientIds }
      });
  
      const planIds = plansClients.map(pc => pc.plan_id);
  
      // Récupérer les détails des plans
      const plansDetails = await plans.findAll({ 
        where: { plan_id: planIds }
      });
  
      // Récupérer les transactions et calculer le total des revenus
      const transactions = await transaction.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('montant_paye')), 'totalRevenue']
        ],
        where: {
          status_transaction: TRANSACTION_STATUS_PAID,
          plan_id: planIds
        },
        group: ['plan_id']
      });
  
      const totalRevenue = transactions.reduce((acc, transaction) => 
        acc + parseFloat(transaction.dataValues.totalRevenue), 0);
  
      // Assembler les données du dashboard modérateur
      const moderateurDashboard = {
        totalClients,
        totalSuccessfulSMS,
        totalFailedSMS,
        totalRevenue
      };
  
      await this.loggingService.log('Fetched moderateur dashboard');
  
      return moderateurDashboard;
   
    } catch (error) {
      await this.loggingService.log(`Failed to fetch moderateur dashboard: ${error.message}`);
      throw new Error('Failed to fetch moderateur dashboard');
    }

  }
  
  
  async getAdminDashboard() {
    try {
      // Récupérer le total des clients
      const totalClients = await clients.count();

      // Récupérer le total des SMS réussis et échoués
      const totalSuccessfulSMS = await messages.count({ where: { status: SMS_STATUS_SUCCESS } });
      const totalFailedSMS = await messages.count({ where: { status: SMS_STATUS_FAILED } });
      
      const transactions = await transaction.findAll({
        attributes: [
            [sequelize.literal('(SELECT SUM(montant_paye) FROM transactions WHERE transactions.plan_id = plan.plan_id AND transactions.status_transaction = :status)'), 'totalRevenue'],
        ],
        include: [{
            model: plans,
            as: 'plan',
            attributes: []
        }],
        where: {
            status_transaction: TRANSACTION_STATUS_PAID
        },
        group: ['plan.plan_id'],
        replacements: { status: TRANSACTION_STATUS_PAID }
    });
   
    // Somme des montants payés pour chaque plan
    const totalRevenue = transactions.reduce((acc, transaction) => acc + parseFloat(transaction.dataValues.totalRevenue), 0);

      // Assembler les données du dashboard admin
      const adminDashboard = {
          totalClients,
          totalSuccessfulSMS,
          totalFailedSMS,
          totalRevenue,
      };

      await this.loggingService.log('Fetched admin dashboard');

      return adminDashboard;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch admin dashboard: ${error.message}`);
      throw new Error('Failed to fetch admin dashboard');
    }
  }
  

  /*
  async getClientMonthlyStats(clientId, year) {

      try {
        // Récupérer les informations du client
        const client = await clients.findOne({
          where: { client_id: clientId },
          attributes: ['client_id']
        });
    
        // Récupérer les statistiques mensuelles des messages envoyés pour l'année spécifiée
        const monthlyStats = await messages.findAll({
          attributes: [
            [sequelize.fn('MONTH', sequelize.col('date_envoi')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('*')), 'totalSMS'],
            [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'réussi' THEN 1 ELSE 0 END`)), 'successfulSMS'],
            [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'échoué' THEN 1 ELSE 0 END`)), 'failedSMS']
          ],
          where: {
            client_id: client.client_id,
            [Op.and]: sequelize.literal(`YEAR(date_envoi) = ${year}`)
          },
          group: [sequelize.fn('MONTH', sequelize.col('date_envoi'))],
        });
    
        await this.loggingService.log(`Fetched monthly stats for client ${clientId} in ${year}`);
        
        return monthlyStats;
      } catch (error) {
        await this.loggingService.log(`Failed to fetch client monthly stats: ${error.message}`);
        throw new Error('Failed to fetch client monthly stats');
      }
  }
  
  */

  

  async getClientMonthlyStats(clientId, year) {
    try {
      // Récupérer le plan choisi par le client
      const planClient = await plans_clients.findOne({ where: { client_id: clientId } });
      if (!planClient) {
        throw new Error('Plan not found for this client');
      }
  
      const plan = await plans.findByPk(planClient.plan_id);
      if (!plan) {
        throw new Error('Plan details not found');
      }
  
      // Récupérer les statistiques mensuelles des messages envoyés par le client pour l'année spécifiée
      const monthlyStats = await messages.findAll({
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('date_envoi')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('*')), 'count']
        ],
        where: {
          client_id: clientId,
          [Op.and]: sequelize.literal(`YEAR(date_envoi) = ${year}`)
        },
        group: [sequelize.fn('MONTH', sequelize.col('date_envoi'))],
      });

      await this.loggingService.log(`Fetched monthly stats for client ${clientId} in ${year}`);
  
      return monthlyStats;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch client monthly stats: ${error.message}`);
      throw new Error('Failed to fetch client monthly stats');
    }
  }


  async getModerateurMonthlyStats(moderateurId, year) {
    try {
      // Récupérer les informations des clients du modérateur
      const client = await clients.findAll({
        where: { mod_id: moderateurId },
        attributes: ['client_id']
      });
      
      if (client.length === 0) {
        throw new Error('Clients not found for the given moderator');
      }
  
      const clientIds = client.map(client => client.client_id);
  
      // Récupérer les statistiques mensuelles des messages envoyés pour l'année spécifiée
      const monthlyStats = await messages.findAll({
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('date_envoi')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('*')), 'totalSMS'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'réussi' THEN 1 ELSE 0 END`)), 'successfulSMS'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'échoué' THEN 1 ELSE 0 END`)), 'failedSMS']
        ],
        where: {
          client_id: clientIds,
          [Op.and]: sequelize.literal(`YEAR(date_envoi) = ${year}`)
        },
        group: [sequelize.fn('MONTH', sequelize.col('date_envoi'))],
      });
  
      await this.loggingService.log(`Fetched monthly stats for modérateur ${moderateurId} in ${year}`);
      
      return monthlyStats;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch moderateur monthly stats: ${error.message}`);
      throw new Error('Failed to fetch moderateur monthly stats');
    }
  }
  

  async getAdminMonthlyStats(year) {
    try {
      // Récupérer les statistiques mensuelles des messages envoyés pour l'année spécifiée
      const monthlyStats = await messages.findAll({
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('date_envoi')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('*')), 'totalSMS'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'réussi' THEN 1 ELSE 0 END`)), 'successfulSMS'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'échoué' THEN 1 ELSE 0 END`)), 'failedSMS']
        ],
        where: sequelize.literal(`YEAR(date_envoi) = ${year}`),
        group: [sequelize.fn('MONTH', sequelize.col('date_envoi'))],
      });
  
      await this.loggingService.log(`Fetched monthly stats for admin in ${year}`);
      
      return monthlyStats;
    } catch (error) {
      await this.loggingService.log(`Failed to fetch admin monthly stats: ${error.message}`);
      throw new Error('Failed to fetch admin monthly stats');
    }
  }
  
  

  // Fonction pour générer un rapport pour les administrateurs
  async generateAdminReport(year, format) {
    try {
      // Récupérer les données des messages pour l'année spécifiée
      const reportData = await messages.findAll({ where: { date_envoi: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] } } });

      if (format === 'pdf') {
        // Générer un rapport au format PDF
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`admin_report_${year}.pdf`));

        // Écrire les données dans le PDF
        reportData.forEach((data, index) => {
          doc.text(`${index + 1}. ${JSON.stringify(data)}`, { width: 500 });
        });

        doc.end();
        await this.loggingService.log(`Generated admin report for ${year} in PDF format`);
        return `admin_report_${year}.pdf`;
      } else if (format === 'csv') {
        // Générer un rapport au format CSV
        const csvWriter = createCsvWriter({
          path: `admin_report_${year}.csv`,
          header: [
            { id: 'sms_id', title: 'SMS ID' },
            { id: 'client_id', title: 'Client ID' },
            { id: 'entete', title: 'Entete' },
            { id: 'heure_envoi', title: 'Heure Envoi' },
            { id: 'date_envoi', title: 'Date Envoi' },
            { id: 'status', title: 'Status' },
          ]
        });

        // Écrire les données dans le fichier CSV
        await csvWriter.writeRecords(reportData);

        await this.loggingService.log(`Generated admin report for ${year} in CSV format`);
        return `admin_report_${year}.csv`;
      } else {
        throw new Error('Invalid report format. Please specify "pdf" or "csv".');
      }
    } catch (error) {
      await this.loggingService.log(`Failed to generate admin report: ${error.message}`);
      throw new Error('Failed to generate admin report');
    }
  }

  // Fonction pour générer un rapport pour les clients
  async generateClientReport(clientId, year, format) {
    try {
      // Récupérer les données des messages pour l'année spécifiée
      const reportData = await messages.findAll({ where: { client_id: clientId, date_envoi: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] } } });

      if (format === 'pdf') {
        // Générer un rapport au format PDF
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`client_report_${year}.pdf`));

        // Écrire les données dans le PDF
        reportData.forEach((data, index) => {
          doc.text(`${index + 1}. ${JSON.stringify(data)}`, { width: 500 });
        });

        doc.end();
        await this.loggingService.log(`Generated client report for ${year} in PDF format`);
        return `client_report_${year}.pdf`;
      } else if (format === 'csv') {
        // Générer un rapport au format CSV
        const csvWriter = createCsvWriter({
          path: `client_report_${year}.csv`,
          header: [
            { id: 'sms_id', title: 'SMS ID' },
            { id: 'entete', title: 'Entete' },
            { id: 'heure_envoi', title: 'Heure Envoi' },
            { id: 'date_envoi', title: 'Date Envoi' },
            { id: 'status', title: 'Status' },
          ]
        });

        // Écrire les données dans le fichier CSV
        await csvWriter.writeRecords(reportData);

        await this.loggingService.log(`Generated client report for ${year} in CSV format`);
        return `client_report_${year}.csv`;
      } else {
        throw new Error('Invalid report format. Please specify "pdf" or "csv".');
      }
    } catch (error) {
      await this.loggingService.log(`Failed to generate client report: ${error.message}`);
      throw new Error('Failed to generate client report');
    }
  }

  async generateModerateurReport(moderateurId, year, format) {
    try {

      // Récupérer les informations du modérateur
      const moderateur = await moderateurs.findOne({ where: { mod_id: moderateurId },
        attributes: ['client_id'] });
      if (!moderateur) {
        throw new Error('Modérateur not found');
      }
      // Récupérer les données des messages pour l'année spécifiée
      const reportData = await messages.findAll({ where: { client_id: moderateur.client_id, date_envoi: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] } } });

      if (format === 'pdf') {
        // Générer un rapport au format PDF
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`modérateur_report_${year}.pdf`));

        // Écrire les données dans le PDF
        reportData.forEach((data, index) => {
          doc.text(`${index + 1}. ${JSON.stringify(data)}`, { width: 500 });
        });

        doc.end();
        await this.loggingService.log(`Generated modérateur report for ${year} in PDF format`);
        return `modérateur_report_${year}.pdf`;
      } else if (format === 'csv') {
        // Générer un rapport au format CSV
        const csvWriter = createCsvWriter({
          path: `modérateur_report_${year}.csv`,
          header: [
            { id: 'sms_id', title: 'SMS ID' },
            { id: 'entete', title: 'Entete' },
            { id: 'heure_envoi', title: 'Heure Envoi' },
            { id: 'date_envoi', title: 'Date Envoi' },
            { id: 'status', title: 'Status' },
          ]
        });

        // Écrire les données dans le fichier CSV
        await csvWriter.writeRecords(reportData);

        await this.loggingService.log(`Generated modérateur report for ${year} in CSV format`);
        return `modérateur_report_${year}.csv`;
      } else {
        throw new Error('Invalid report format. Please specify "pdf" or "csv".');
      }
    } catch (error) {
      await this.loggingService.log(`Failed to generate modérateur report: ${error.message}`);
      throw new Error('Failed to generate modérateur report');
    }
  }

}

module.exports = new StatistiquesService(new LoggingService());
