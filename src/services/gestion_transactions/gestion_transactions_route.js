const express = require("express");
const router = express.Router();
const gestion_transactions_controller = require("./controllers/gestion_transactions_controller");
const authMiddleware = require("./../../middlewares/auth_middleware");

router.get(
  "/getAllTransactionsForClient/:clientId/:page?",authMiddleware(['admin','moderateur','client']),
  gestion_transactions_controller.getAllTransactionsForClient
);
router.get(
  "/getAllTransactions",authMiddleware(['client']),
  gestion_transactions_controller.getAllTransactions
);
router.get(
  "/getTransactionById/:id",authMiddleware(['client']),
  gestion_transactions_controller.getTransactionById
);
router.post(
  "/createTransaction",authMiddleware(['client']),
  gestion_transactions_controller.createTransaction
);

module.exports = router;
