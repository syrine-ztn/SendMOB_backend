//notifications/routes.js

const express = require('express');
const router = express.Router();
const notifications_controller = require('./controllers/notifications_controller');
const authMiddleware = require("./../../middlewares/auth_middleware");


router.post('/notifier/:clientId', authMiddleware(['admin','moderateur','client']), notifications_controller.notifier);
router.get('/getNotifications',authMiddleware(['client']), notifications_controller.getAllNotifications);
router.put('/updateNotification/:id',authMiddleware(['client']), notifications_controller.updateNotification);

// routes for admin operations
router.post('/admin/notifier',authMiddleware(['admin','moderateur','client']), notifications_controller.adminNotifier);
router.get('/admin/getNotifications',authMiddleware(['admin']), notifications_controller.adminGetAllNotifications);
router.put('/admin/updateNotification/:id',authMiddleware(['admin']), notifications_controller.adminUpdateNotification);

router.post('/moderateur/notifier/:modId', authMiddleware(['admin','moderateur','client']), notifications_controller.moderateurNotifier);
router.get('/moderateur/getNotifications',authMiddleware(['moderateur']), notifications_controller.moderateurGetAllNotifications);
router.put('/moderateur/updateNotification/:id',authMiddleware(['moderateur']), notifications_controller.moderateurUpdateNotification);

module.exports = router;
