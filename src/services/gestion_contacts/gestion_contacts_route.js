const express = require("express");
const router = express.Router();
const gestion_contacts_controller = require("./controllers/gestion_contacts_controller");
const authMiddleware = require("./../../middlewares/auth_middleware");

router.get("/getAllContacts/:page?",authMiddleware(['client']),gestion_contacts_controller.getAllContacts);
router.get("/getContactById/:id",authMiddleware(['client']), gestion_contacts_controller.getContactById);
router.post("/createContact",authMiddleware(['client']), gestion_contacts_controller.createContact);
router.delete("/deleteContact/:id",authMiddleware(['client']), gestion_contacts_controller.deleteContact);
router.get("/getAllContactsForClient/:page?",authMiddleware(['client']), gestion_contacts_controller.getAllContactsForClient);
router.get("/getAllContactsForClientPerLabel/:page?/:label",authMiddleware(['client']), gestion_contacts_controller.getAllContactsForClientPerLabel);

module.exports = router;
