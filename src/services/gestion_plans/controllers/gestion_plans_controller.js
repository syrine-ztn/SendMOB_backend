const gestionPlansService = require("../service/gestion_plans_service");

exports.getAllPlans = async (req, res) => {
  try {
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    const allPlans = await gestionPlansService.getAllPlans(page);
    res.status(200).json(allPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPlansForModerateur = async (req, res) => {
  try {
    let page = req.params.page; // Récupérer le numéro de la page depuis les paramètres de la requête
    const id = req.params.id;
    const allPlans = await gestionPlansService.getAllPlansForModerateur(id,page);
    res.status(200).json(allPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPlanById = async (req, res) => {
  const planId = req.params.id;
  try {
    const plan = await gestionPlansService.getPlanById(planId);
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlanByclientId = async (req, res) => {
  const clientId = req.params.id;
  try {
    const plan = await gestionPlansService.getPlanByclientId(clientId);
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlanForClient = async (req, res) => {
  const moderateurId = req.params.id;
  try {
    const plan = await gestionPlansService.getPlanForClient(moderateurId);
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPlan = async (req, res) => {
  const planData = req.body;
  try {
    const createdPlan = await gestionPlansService.createPlan(planData);
    res.status(201).json(createdPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  const planId = req.params.id;
  const updatedPlanData = req.body;
  try {
    const updatedPlan = await gestionPlansService.updatePlan(
      planId,
      updatedPlanData
    );
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
