import NotificationService from '../services/notificationService.js';
import config from '../config/config.js';

export default class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();
    }

    async sendNotification(info) {
        switch (config.notification) {
            case "EMAIL":
                return this.notificationService.sendEmail(info);
            case "SMS":
                return this.notificationService.sendSMS(info);
            default:
                throw new Error("Invalid type");
        }
    }
}