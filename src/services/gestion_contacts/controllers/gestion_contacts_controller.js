const gestionContactsService = require("../service/gestion_contacts_service");

exports.getAllContacts = async (req, res) => {
  try {
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    const allContacts = await gestionContactsService.getAllContacts(page);
    res.status(200).json(allContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

exports.getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await gestionContactsService.getContactById(id);
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contact" });
  }
};

exports.createContact = async (req, res) => {
  const contactData = req.body;
  try {
    const newContact = await gestionContactsService.createContact(contactData);
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create contact" });
  }
};

exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await gestionContactsService.deleteContact(id);
    res.status(200).json(deletedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
};

exports.getAllContactsForClient = async (req, res) => {
  try {
    const userId = req.userId;
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    const allContacts = await gestionContactsService.getAllContactsForClient(userId,page);
    res.status(200).json(allContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

exports.getAllContactsForClientPerLabel = async (req, res) => {
  try {
    const userId = req.userId;
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    const label = req.params.label; 
    const allContacts = await gestionContactsService.getAllContactsForClientPerLabel(userId, label, page);
    res.status(200).json(allContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};