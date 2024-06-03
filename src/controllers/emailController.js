import NotificationManager from "../dao/NotificationManager";
import config from "../config";

export default class EmailController {
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