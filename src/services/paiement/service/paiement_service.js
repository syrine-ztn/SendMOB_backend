/*
const initModels = require('./../../../../models/init-models');
const sequelize = require('./../../../../db');
const PDFDocument = require('pdfkit');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const { Op } = require('sequelize');
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const clients = models['clients'];
const plans = models['plans'];
const messages = models['messages'];
const plans_clients = models['plans_clients'];
const transaction = models['transactions'];

const TRANSACTION_STATUS_PAID = 'payé';
const TRANSACTION_STATUS_SUSPENDED = 'Suspendu';

// Constantes pour les états des SMS
const SMS_STATUS_SUCCESS = 'réussi';
const SMS_STATUS_FAILED = 'échoué';

const stripe = require('stripe')('sk_test_51P5uDeP84FUA7AxbkbP6dHQmbtL2VtyZlm60sP2E5rge9pICEzRgYqRL27nCSzZ7XQyZ9xIy5tx4K8n1TkTGRhCq004p0A8P4u');



// Créer un élément de facture pour un client spécifique
async function addInvoiceItem(customerId, amount, description) {
  // Convertir le montant en centimes
  const amountInCents = Math.round(parseFloat(amount) * 10000);

  const item = await stripe.invoiceItems.create({
    customer: customerId,
    amount: amountInCents,
    currency: 'usd', // Utilisez la même devise que le montant spécifié
    description: description,
  });
  return item;
}



class PaiementService {
  constructor(loggingService) {
    this.loggingService = loggingService;
  }

  async renouvelerPaiement(clientId, methodePaiement) {
    const client = await clients.findByPk(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
  
    let stripeCustomerId = client.stripe_customer_id;
  
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: client.email,
        name: client.corporation_name,
      });
  
      stripeCustomerId = stripeCustomer.id;
      await client.update({ stripe_customer_id: stripeCustomerId });
    }
  
    // Ajouter un élément de facture
    await addInvoiceItem(stripeCustomerId, 1000, "Renouvellement d'abonnement pour le mois");

    // Créer la facture
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      auto_advance: true,
    });

    // Finaliser la facture
    await stripe.invoices.finalizeInvoice(invoice.id);
   
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.amount_due,
      currency: 'usd',
      customer: stripeCustomerId,
      off_session: true,
      confirm: true,
    });
  
    if (paymentIntent.status === 'succeeded') {
      await this.loggingService.log(`Paiement réussi pour le client ${clientId}`);
      // Rediriger l'utilisateur vers l'interface de paiement
      return { message: 'Paiement réussi', paymentUrl: invoice.hosted_invoice_url };
    } else {
      await this.loggingService.log(`Échec du paiement pour le client ${clientId}`);
      throw new Error('Échec du paiement');
    }
  }
}
  

module.exports = new PaiementService(new LoggingService());
*/



const initModels = require('../../../../models/init-models');
const sequelize = require('../../../../db');
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const clients = models['clients'];
const plans = models['plans'];
const messages = models['messages'];
const plans_clients = models['plans_clients'];
const transaction = models['transactions'];

const TRANSACTION_STATUS_PAID = 'payé';
const TRANSACTION_STATUS_SUSPENDED = 'Suspendu';
const keys = require('./../paiement_config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);


class PaiementService {
  constructor() {
      this.loggingService = new LoggingService();
  }

  async processPayment(data) {
    try {
        // Insérer une entrée de succès dans la table "transactions"
        const newTransaction = await transaction.create({
            methode_paiement: 'success', // Définir la méthode de paiement comme réussie
            montant_paye: data.montantPaye, // Récupérer le montant payé depuis les données de la demande
            date_paiement: new Date(), // Définir la date de paiement comme la date actuelle
            status_transaction: 'success', // Définir le statut de la transaction comme réussi
            plan_id: data.planId // Récupérer l'ID du plan depuis les données de la demande
        });

        // Retourner un message de succès
        return { message: 'Paiement réussi' };
    } catch (error) {
        throw new Error(`Échec du paiement : ${error.message}`);
    }
}

}



module.exports = PaiementService;
