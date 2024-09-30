const express = require("express");
const router = express.Router();
const gestion_adresses_controller = require("./controllers/gestion_adresses_controller");
const authMiddleware = require("./../../middlewares/auth_middleware");

router.get("/getAllAdressesForClient/:userId/:page?",authMiddleware(['admin','moderateur','client']), gestion_adresses_controller.getAllAdressesForClient);
router.get("/getAdresseById/:id",authMiddleware(['admin','moderateur','client']), gestion_adresses_controller.getAdresseById);
router.post("/createAdresse",authMiddleware(['admin','moderateur','client']), gestion_adresses_controller.createAdresse);
router.delete("/deleteAdresse/:id",authMiddleware(['admin','moderateur','client']), gestion_adresses_controller.deleteAdresse);
router.put("/updateAdresse/:id",authMiddleware(['admin','moderateur','client']), gestion_adresses_controller.updateAdresse);

module.exports = router;
