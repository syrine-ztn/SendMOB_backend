const gestionClientsService = require('./../service/gestion_clients_service');

exports.getAllClients = async (req, res) => {
  try {
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête

    const allClients = await gestionClientsService.getAllClients(page);
    res.status(200).json(allClients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};


exports.getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await gestionClientsService.getClientById(id);
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

exports.getClientForModerateur = async (req, res) => {
  let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
  const id = req.params.id;
  try {
    const client = await gestionClientsService.getClientForModerateur(id,page);
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

exports.createClient = async (req, res) => {
  const clientData = req.body;
  try {
    const newClient = await gestionClientsService.createClient(clientData);
    res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClient = await gestionClientsService.deleteClient(id);
    res.status(200).json(deletedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const clientData = req.body;
  try {
    const updatedClient = await gestionClientsService.updateClient(id, clientData);
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

exports.updateProfileClient = async (req, res) => {
  const id = req.userId; // Utilisation de req.userId pour obtenir l'ID à partir de la middleware
  const clientData = req.body;
  try {
    const updatedClient = await gestionClientsService.updateProfileClient(id, clientData);
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

exports.blockClient = async (req, res) => {
  const { id } = req.params;
  try {
    const blockedClient = await gestionClientsService.blockClient(id);
    res.status(200).json(blockedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to block client' });
  }
};


exports.debloquerClient = async (req, res) => {
  const clientId = req.params.id;

  try {
    const unblockedClient = await gestionClientsService.debloquerClient(clientId);
    res.status(200).json(unblockedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unblock client' });
  }
};