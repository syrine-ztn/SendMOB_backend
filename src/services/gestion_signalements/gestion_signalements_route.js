const express = require("express");
const router = express.Router();
const gestion_signalements_controller = require("./controllers/gestion_signalements_controller");
const authMiddleware = require("./../../middlewares/auth_middleware");

router.get(
  "/getAllSignalements/:page?",authMiddleware(['admin','moderateur']),
  gestion_signalements_controller.getAllSignalements
);
router.get(
  "/getSignalementById/:id",authMiddleware(['admin','moderateur','client']),
  gestion_signalements_controller.getSignalementById
);
router.get(
  "/getSignalementForClient/:id/:page?",authMiddleware(['admin','moderateur']),
  gestion_signalements_controller.getSignalementForClient
);
router.post(
  "/createSignalement",authMiddleware(['client']),
  gestion_signalements_controller.createSignalement
);
router.get(
  "/getSignalementsOfClient/:page?",authMiddleware(['client']),
  gestion_signalements_controller.getSignalementsOfClient
);

router.put('/updateSignalement/:id',authMiddleware(['admin', 'moderateur']), gestion_signalements_controller.updateSignalement);


module.exports = router;
