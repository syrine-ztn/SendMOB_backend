// authentification/routes.js

const express = require('express');
const router = express.Router();
const authentification_controller = require('./controllers/authentification_controller');


// Endpoint pour la connexion
router.post('/login', authentification_controller.login);

router.post('/recupererMotDePasse', authentification_controller.recupererMotDePasse);


module.exports = router;
