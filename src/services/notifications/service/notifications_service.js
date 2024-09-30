const initModels = require('./../../../../models/init-models');
const sequelize = require('./../../../../db');
const LoggingService = require('../../../services/logging/logging');

const models = initModels(sequelize);
const notifications = models['notifications'];
const notificationsAdmin = models['notifications_admin'];
const notificationsModerateur = models['notifications_moderateur'];

class NotificationsService {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }

    async createNotification(clientId, notificationData) {
        try {
            // Add the clientId to the notificationData object
            notificationData.client_id = clientId;

            const notification = await notifications.create(notificationData);
            await this.loggingService.log(`Notification created for client ${clientId}`);
            return notification;
        } catch (error) {
            await this.loggingService.log(`Failed to create notification for client ${clientId}: ${error.message}`);
            throw new Error('Failed to create notification');
        }
    }

    async getAllNotifications(clientId) {
        try {
            const allNotifications = await notifications.findAll({ where: { client_id: clientId } });
            await this.loggingService.log(`Fetched all notifications for client ${clientId}`);
            return allNotifications;
        } catch (error) {
            await this.loggingService.log(`Failed to fetch notifications for client ${clientId}: ${error.message}`);
            throw new Error('Failed to fetch notifications');
        }
    }

    async createAdminNotification(adminNotificationData) {
        try {
            const notification = await notificationsAdmin.create(adminNotificationData);
            await this.loggingService.log('Admin notification created');
            return notification;
        } catch (error) {
            await this.loggingService.log(`Failed to create admin notification: ${error.message}`);
            throw new Error('Failed to create admin notification');
        }
    }

    async adminGetAllNotifications() {
        try {
            const allNotifications = await notificationsAdmin.findAll();
            await this.loggingService.log('Fetched all admin notifications');
            return allNotifications;
        } catch (error) {
            await this.loggingService.log(`Failed to fetch admin notifications: ${error.message}`);
            throw new Error('Failed to fetch admin notifications');
        }
    }


    async createModerateurNotification(modId,moderateurNotificationData) {
        try {
            moderateurNotificationData.mod_id = modId;
            const notification = await notificationsModerateur.create(moderateurNotificationData);
            await this.loggingService.log('Moderateur notification created');
            return notification;
        } catch (error) {
            await this.loggingService.log(`Failed to create moderateur notification: ${error.message}`);
            throw new Error('Failed to create moderateur notification');
        }
    }

    async moderateurGetAllNotifications(modId) {
        try {
            const allNotifications = await notificationsModerateur.findAll({ where: { mod_id: modId } });
            await this.loggingService.log('Fetched all moderateur notifications');
            return allNotifications;
        } catch (error) {
            await this.loggingService.log(`Failed to fetch moderateur notifications: ${error.message}`);
            throw new Error('Failed to fetch moderateur notifications');
        }
    }


    async updateNotification(Id, Data) {
        try {
         
          const updated = await notifications.update(Data, { where: { notification_id: Id } });
          return updated;
        } catch (error) {
          // Log the error if updating fails
          await this.loggingService.log(`Failed to update notification with ID ${Id}: ${error.message}`);
          throw new Error('Failed to update notification');
        }
      }

      
      async adminUpdateNotification(Id, Data) {
        try {
         
          const updated = await notificationsAdmin.update(Data, { where: { notification_id: Id } });
          return updated;
        } catch (error) {
          // Log the error if updating fails
          await this.loggingService.log(`Failed to update notification with ID ${Id}: ${error.message}`);
          throw new Error('Failed to update notification');
        }
      }

      
      async moderateurUpdateNotification(Id, Data) {
        try {
         
          const updated = await notificationsModerateur.update(Data, { where: { notification_id: Id } });
          return updated;
        } catch (error) {
          // Log the error if updating fails
          await this.loggingService.log(`Failed to update notification with ID ${Id}: ${error.message}`);
          throw new Error('Failed to update notification');
        }
      }
    
}

module.exports = new NotificationsService(new LoggingService());
