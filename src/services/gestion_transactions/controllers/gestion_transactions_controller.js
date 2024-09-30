const gestionTransactionsService = require("../service/gestion_transactions_service");

exports.getAllTransactions = async (req, res) => {
  try {
    const allTransactions =
      await gestionTransactionsService.getAllTransactions();
    res.status(200).json(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

exports.getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await gestionTransactionsService.getTransactionById(id);
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

exports.getAllTransactionsForClient = async (req, res) => {
  let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
  const clientId = req.params.clientId;
  try {
    const allTransactions =
      await gestionTransactionsService.getAllTransactionsForClient(clientId,page);
    res.status(200).json(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

exports.createTransaction = async (req, res) => {
  const TransactionData = req.body;
  try {
    const newTransaction = await gestionTransactionsService.createTransaction(
      TransactionData
    );
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};