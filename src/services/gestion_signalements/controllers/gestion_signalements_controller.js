const gestionSignalementsService = require("./../service/gestion_signalements_service");

exports.getAllSignalements = async (req, res) => {
  try {
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    const allSignalements =
      await gestionSignalementsService.getAllSignalements(page);
    res.status(200).json(allSignalements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch signalements" });
  }
};

exports.getSignalementById = async (req, res) => {
  const { id } = req.params;
  try {
    const signalement = await gestionSignalementsService.getSignalementById(id);
    res.status(200).json(signalement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch signalement" });
  }
};

exports.getSignalementForClient = async (req, res) => {
  const moderateurId  = req.params.id;
  let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
  try {
    const signalement = await gestionSignalementsService.getSignalementForClient(moderateurId,page);
    res.status(200).json(signalement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch signalement" });
  }
};

exports.createSignalement = async (req, res) => {
  const signalementData = req.body;
  try {
    const newSignalement = await gestionSignalementsService.createSignalement(
      signalementData
    );
    res.status(201).json(newSignalement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create signalement" });
  }
};

exports.getSignalementsOfClient = async (req, res) => {
  const userId = req.userId;
  let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
  try {
    const signalement = await gestionSignalementsService.getSignalementsOfClient(userId,page);
    res.status(200).json(signalement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch signalement" });
  }
};

exports.updateSignalement = async (req, res) => {
  const { id } = req.params;
  const Data = req.body;
  try {
    const updated = await gestionSignalementsService.updateSignalement(id, Data);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update signalement' });
  }
};