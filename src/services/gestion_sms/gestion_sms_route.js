const express = require("express");
const router = express.Router();
const gestion_sms_controller = require("./controllers/gestion_sms_controller");
const authMiddleware = require("../../middlewares/auth_middleware");

router.get(
  "/getAllSMSs/:page?",authMiddleware(['client']),
  gestion_sms_controller.getAllSMSs
);
router.get(
  "/getSMSById/:id",authMiddleware(['client']),
  gestion_sms_controller.getSMSById
);
router.get(
  "/getSMSForClient/:page?",authMiddleware(['client']),
  gestion_sms_controller.getSMSForClient
);


module.exports = router;
