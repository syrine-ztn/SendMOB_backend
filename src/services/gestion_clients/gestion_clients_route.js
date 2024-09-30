const express = require('express');
const router = express.Router();
const gestion_clients_controller = require('./controllers/gestion_clients_controller');
const authMiddleware = require("./../../middlewares/auth_middleware");

router.get('/getAllClients/:page?',authMiddleware(['admin', 'moderateur']),gestion_clients_controller.getAllClients);
router.get('/getClientById/:id',authMiddleware(['admin', 'moderateur','client']),gestion_clients_controller.getClientById);
router.get('/getClientForModerateur/:id/:page?',authMiddleware(['admin', 'moderateur']),gestion_clients_controller.getClientForModerateur);
router.post('/createClient',authMiddleware(['admin', 'moderateur']),gestion_clients_controller.createClient);
router.delete('/deleteClient/:id',authMiddleware(['admin', 'moderateur']), gestion_clients_controller.deleteClient);
router.put('/updateClient/:id',authMiddleware(['admin', 'moderateur']), gestion_clients_controller.updateClient);
router.put('/updateProfileClient', authMiddleware(['client']),gestion_clients_controller.updateProfileClient);
router.put('/blockClient/:id',authMiddleware(['admin', 'moderateur']), gestion_clients_controller.blockClient);
router.put('/debloquerClient/:id',authMiddleware(['admin', 'moderateur']), gestion_clients_controller.debloquerClient);

module.exports = router;
