// notifications/controllers/notifications_controller.js
const notificationsService = require('./../service/notifications_service');


// Controller method to create a notification for a specific client
exports.notifier = async (req, res) => {
    try {
        const clientId = req.params.clientId; // Assuming the client ID is passed as a route parameter
        const notificationData = req.body; // Assuming notification data is sent in the request body
        const notification = await notificationsService.createNotification(clientId, notificationData);
        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};


// Controller method to get all notifications for a specific client
exports.getAllNotifications = async (req, res) => {
    try {
        const clientId = req.userId; // Assuming the client ID is stored in req.userId after authentication
        // Call the service method to fetch all notifications for the client
        const notifications = await notificationsService.getAllNotifications(clientId);
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};


exports.adminNotifier = async (req, res) => {
    try {
        const notificationData = req.body;
        const notification = await notificationsService.createAdminNotification(notificationData);
        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

exports.adminGetAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationsService.adminGetAllNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};


exports.moderateurNotifier = async (req, res) => {
    try {
        const modId = req.params.modId;
        const notificationData = req.body;
        const notification = await notificationsService.createModerateurNotification(modId,notificationData);
        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

exports.moderateurGetAllNotifications = async (req, res) => {
    try {
        const modId =  req.userId;
        const notifications = await notificationsService.moderateurGetAllNotifications(modId);
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};


exports.updateNotification = async (req, res) => {
    const { id } = req.params;
    const Data = req.body;
    try {
      const updated = await notificationsService.updateNotification(id, Data);
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update notification' });
    }
  };

  exports.adminUpdateNotification = async (req, res) => {
    const { id } = req.params;
    const Data = req.body;
    try {
      const updated = await notificationsService.adminUpdateNotification(id, Data);
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update notification' });
    }
  };

  exports.moderateurUpdateNotification = async (req, res) => {
    const { id } = req.params;
    const Data = req.body;
    try {
      const updated = await notificationsService.moderateurUpdateNotification(id, Data);
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update notification' });
    }
  };