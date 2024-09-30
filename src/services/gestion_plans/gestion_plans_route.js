const express = require("express");
const router = express.Router();
const gestionPlansController = require("./controllers/gestion_plans_controller");
const authMiddleware = require("./../../middlewares/auth_middleware");
const moderateurs = require("../../../models/moderateurs");

// Route pour obtenir tous les plans
router.get("/getAllPlans/:page?",authMiddleware(['admin']), gestionPlansController.getAllPlans);

// Route pour obtenir tous les plans
router.get("/getAllPlansForModerateur/:id/:page?",authMiddleware(['moderateur']), gestionPlansController.getAllPlansForModerateur);

// Route pour obtenir un plan par son identifiant
router.get("/getPlanById/:id",authMiddleware(['admin','moderateur','client']), gestionPlansController.getPlanById);

// Route pour obtenir un plan par son identifiant
router.get("/getPlanByclientId/:id",authMiddleware(['client']), gestionPlansController.getPlanByclientId);

// Route pour obtenir un plan pour un client
router.get("/getPlanForClient/:id",authMiddleware(['moderateur']), gestionPlansController.getPlanForClient);

// Route pour créer un nouveau plan
router.post("/createPlan",authMiddleware(['admin','moderateur']), gestionPlansController.createPlan);

// Route pour mettre à jour un plan existant
router.put("/updatePlan/:id",authMiddleware(['admin','moderateur']), gestionPlansController.updatePlan);

module.exports = router;
