const express = require('express');
const router = express.Router();
const statistiquesController = require('./controllers/statistiques_controller');
const authMiddleware = require("./../../middlewares/auth_middleware");

// Routes pour les statistiques du client
router.get('/client/dashboard',authMiddleware(['client']), statistiquesController.getClientDashboard);

// Routes pour les statistiques de l'administrateur
router.get('/admin/dashboard',authMiddleware(['admin','moderateur']), statistiquesController.getAdminDashboard);

// Routes pour les statistiques du modérateur
router.get('/moderateur/dashboard',authMiddleware(['moderateur']), statistiquesController.getModerateurDashboard);

// Routes pour les statistiques mensuelles des clients
router.get('/client/monthly-stats/:year',authMiddleware(['client']), statistiquesController.getClientMonthlyStats);

// Routes pour les statistiques mensuelles de l'administrateur
router.get('/admin/monthly-stats/:year',authMiddleware(['admin','moderateur']), statistiquesController.getAdminMonthlyStats);

// Routes pour les statistiques mensuelles du modérateur
router.get('/moderateur/monthly-stats/:year',authMiddleware(['moderateur']), statistiquesController.getModerateurMonthlyStats);

// Routes pour générer un rapport pour les administrateurs
router.get('/admin/report/:year/:format',authMiddleware(['admin','moderateur']), statistiquesController.generateAdminReport);


// Routes pour générer un rapport pour les clients
router.get('/client/report/:year/:format', authMiddleware(['client']), statistiquesController.generateClientReport);


// Routes pour générer un rapport pour les modérateurs
router.get('/modérateur/report/:year/:format', authMiddleware(['moderateur']), statistiquesController.generateModerateurReport);



module.exports = router;
