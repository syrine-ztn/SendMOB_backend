// authentification/controllers/authentification_controller.js
const authService = require('./../service/authentification_service');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.login(email, password);
        // Si la connexion réussit, envoyer les détails de l'utilisateur avec le rôle en tant que réponse
        res.status(200).json(user);
    } catch (error) {
        // Si une erreur se produit, envoyer un message d'erreur
        res.status(401).json({ error: error.message });
    }
};


exports.recupererMotDePasse = async (req, res) => {
    const { email, link } = req.body;
    try {
        const response = await authService.recupererMotDePasse(email, link);
        res.status(200).json(response);
    } catch (error) {
        // Si une erreur se produit, envoyer un message d'erreur
        res.status(401).json({ error: error.message });
    }
};