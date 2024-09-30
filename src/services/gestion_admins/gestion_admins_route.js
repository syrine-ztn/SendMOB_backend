const express = require("express");
const router = express.Router();
const gestion_admins_controller = require("./controllers/gestion_admins_controller");
const authMiddleware = require("./../../middlewares/auth_middleware");

// Route with authorization middleware for 'admin' role
router.put("/updateAdmin", authMiddleware('admin'), gestion_admins_controller.updateAdmin);
router.get('/getAdminById',authMiddleware(['admin']), gestion_admins_controller.getAdminById);
router.put("/updateAdminPwd", gestion_admins_controller.updateAdminPwd);


// Route with authorization middleware for 'moderateur' role
router.put("/updateModerateur", authMiddleware('moderateur'), gestion_admins_controller.updateModerateur);
router.get('/getModerateurById',authMiddleware(['moderateur']), gestion_admins_controller.getModerateurById);
router.put("/updateModerateurPwd", gestion_admins_controller.updateModerateurPwd);


module.exports = router;
