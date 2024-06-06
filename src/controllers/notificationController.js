import NotificationManager from "../dao/NotificationManager.js";
import config from '../config/config.js';

export default class NotificationController {
    constructor() {
        this.notificationManager = new NotificationManager();
    }

    async sendNotification(info) {
        switch (config.notification) {
            case "EMAIL":
                return this.notificationManager.sendEmail(info);
            case "SMS":
                return this.notificationManager.sendSMS(info);
            default:
                throw new Error("Invalid type");
        }
    }
}