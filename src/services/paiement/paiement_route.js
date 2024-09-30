/*
const express = require('express');
const router = express.Router();
const paiementController = require('./controllers/paiement_controller');
const authMiddleware = require("./../../middlewares/auth_middleware");


router.post('/renouveler',paiementController.renouvelerPaiement);


module.exports = router;
*/

const express = require('express');
const router = express.Router();
const paiementController = require('./controllers/paiement_controller');
const authMiddleware = require("./../../middlewares/auth_middleware");


// Route pour effectuer un paiement
router.post('/renouveler', paiementController.processPayment);

module.exports = router;

