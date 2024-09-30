const express = require("express");
const router = express.Router();
const gestion_moderateurs_controller = require("./controllers/gestion_moderateurs_controller");
const authMiddleware = require("./../../middlewares/auth_middleware");

router.get(
  "/getAllModerateurs/:page?/:status_mod?", authMiddleware(['admin']),
  gestion_moderateurs_controller.getAllModerateurs
);
router.get(
  "/getModerateurById/:id",authMiddleware(['admin','moderateur']),
  gestion_moderateurs_controller.getModerateurById
);
router.post(
  "/createModerateur",authMiddleware(['admin']),
  gestion_moderateurs_controller.createModerateur
);
router.delete(
  "/deleteModerateur/:id",authMiddleware(['admin']),
  gestion_moderateurs_controller.deleteModerateur
);
router.put(
  "/updateModerateur/:id",authMiddleware(['admin','moderateur']),
  gestion_moderateurs_controller.updateModerateur
);
router.put(
  "/updateProfileModerateur",authMiddleware(['moderateur']),
  gestion_moderateurs_controller.updateProfileModerateur
);
router.put(
  '/blockModerateur/:id',authMiddleware(['admin']),
  gestion_moderateurs_controller.blockModerateur
);
router.put(
  "/debloquerModerateur/:id",authMiddleware(['admin']),
  gestion_moderateurs_controller.debloquerModerateur
);

module.exports = router;
