const gestionSMSService = require("../service/gestion_sms_service");

exports.getAllSMSs = async (req, res) => {
  try {
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    const allSMSs =
      await gestionSMSService.getAllSMSs(page);
    res.status(200).json(allSMSs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sms" });
  }
};

exports.getSMSById = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await gestionSMSService.getSMSById(id);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sms" });
  }
};

exports.getSMSForClient = async (req, res) => {
  const clientId  = req.userId;
  let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
  try {
    const message = await gestionSMSService.getSMSForClient(clientId,page);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sms" });
  }
};


