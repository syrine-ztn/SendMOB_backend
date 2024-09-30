const gestionAdressesService = require("../service/gestion_adresses_service");

exports.getAllAdressesForClient = async (req, res) => {
  let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
  const userId = req.params.userId;
  try {
    const allAdresses = await gestionAdressesService.getAllAdressesForClient(userId,page);
    res.status(200).json(allAdresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch adresses" });
  }
};

exports.getAdresseById = async (req, res) => {
  const { id } = req.params;
  try {
    const adresse = await gestionAdressesService.getAdresseById(id);
    res.status(200).json(adresse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch adresse" });
  }
};

exports.createAdresse = async (req, res) => {
  const adresseData = req.body;
  try {
    const newAdresse = await gestionAdressesService.createAdresse(adresseData);
    res.status(201).json(newAdresse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create adresse" });
  }
};

exports.deleteAdresse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAdresse = await gestionAdressesService.deleteAdresse(id);
    res.status(200).json(deletedAdresse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete adresse" });
  }
};

exports.updateAdresse = async (req, res) => {
  const { id } = req.params;
  const adresseData = req.body;
  try {
    const updatedAdresse = await gestionAdressesService.updateAdresse(
      id,
      adresseData
    );
    res.status(200).json(updatedAdresse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update adresse" });
  }
};
