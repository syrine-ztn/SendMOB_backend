const gestionModerateursService = require("./../service/gestion_moderateurs_service");

exports.getAllModerateurs = async (req, res) => {
  try {
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    let status =  req.params.status_mod;
    const allModerateurs = await gestionModerateursService.getAllModerateurs(page,status);
    res.status(200).json(allModerateurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch moderateurs" });
  }
};

exports.getModerateurById = async (req, res) => {
  const { id } = req.params;
  try {
    const moderateur = await gestionModerateursService.getModerateurById(id);
    res.status(200).json(moderateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch moderateur" });
  }
};

exports.createModerateur = async (req, res) => {
  const moderateurData = req.body;
  try {
    const newModerateur = await gestionModerateursService.createModerateur(
      moderateurData
    );
    res.status(201).json(newModerateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create moderateur" });
  }
};

exports.deleteModerateur = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedModerateur = await gestionModerateursService.deleteModerateur(
      id
    );
    res.status(200).json(deletedModerateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete moderateur" });
  }
};

exports.updateModerateur = async (req, res) => {
  const { id } = req.params;
  const moderateurData = req.body;
  try {
    const updatedModerateur = await gestionModerateursService.updateModerateur(
      id,
      moderateurData
    );
    res.status(200).json(updatedModerateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update moderateur" });
  }
};

exports.updateProfileModerateur = async (req, res) => {
  const id = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  const moderateurData = req.body;
  try {
    const updatedModerateur = await gestionModerateursService.updateProfileModerateur(
      id,
      moderateurData
    );
    res.status(200).json(updatedModerateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update moderateur" });
  }
};

exports.blockModerateur = async (req, res) => {
  const { id } = req.params;
  try {
    const blockedModerateur = await gestionModerateursService.blockModerateur(id);
    res.status(200).json(blockedModerateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to block moderateur" });
  }
};

exports.debloquerModerateur = async (req, res) => {
  const moderateurId = req.params.id;

  try {
    const unblockedModerateur =
      await gestionModerateursService.debloquerModerateur(moderateurId);
    res.status(200).json(unblockedModerateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unblock moderateur" });
  }
};
