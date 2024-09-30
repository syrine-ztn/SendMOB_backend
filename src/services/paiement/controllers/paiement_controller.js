/*
const PaiementService = require('./../service/paiement_service');
const fs = require('fs');



exports.renouvelerPaiement = async (req, res) => {
  const clientId = 1; // Utilisation de req.userId pour obtenir l'ID du client à partir de la middleware

  const methodePaiement = req.body;
  try {
    const resultatPaiement = await PaiementService.renouvelerPaiement(clientId, methodePaiement);
    res.status(200).json(resultatPaiement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/


const PaiementService = require('./../service/paiement_service');

exports.processPayment = async (req, res) => {
    try {
        const paiementService = new PaiementService();
        const result = await paiementService.processPayment(req.body);
        res.json({ success: true, message: 'Paiement réussi', data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Échec du paiement', error: error.message });
    }
};

