const gestionAdminsService = require("../service/gestion_admins_service");

exports.updateAdmin = async (req, res) => {
  const id = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  const adminData = req.body;
  try {
    const updatedAdmin = await gestionAdminsService.updateAdmin(id, adminData);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update admin" });
  }
};

exports.updateAdminPwd = async (req, res) => {
  const adminData = req.body;
  try {
    const updatedAdmin = await gestionAdminsService.updateAdminPwd(adminData);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update admin" });
  }
};


exports.getAdminById = async (req, res) => {
  const id = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  try {
    const admin = await gestionAdminsService.getAdminById(id);
    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get admin" });
  }
};


exports.updateModerateur = async (req, res) => {
  const id = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  const moderateurData = req.body;
  try {
    const updatedModerateur = await gestionAdminsService.updateModerateur(id, moderateurData);
    res.status(200).json(updatedModerateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update moderateur" });
  }
};


exports.getModerateurById = async (req, res) => {
  const id = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  try {
    const moderateur = await gestionAdminsService.getModerateurById(id);
    res.status(200).json(moderateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get moderateur" });
  }
};


exports.updateModerateurPwd = async (req, res) => {
  const Data = req.body;
  try {
    const updated = await gestionAdminsService.updateModerateurPwd(Data);
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update modérateur" });
  }
};