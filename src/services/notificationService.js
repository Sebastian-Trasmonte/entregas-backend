import NotificationManager from "../dao/NotificationManager.js";

export default class NotificationService {

    constructor() {
        this.notificationManager = new NotificationManager();
    }

    async sendEmail(info) {
        return this.notificationManager.sendEmail(info);
    }

    async sendSMS(info) {
        return this.notificationManager.sendSMS(info);
    }
};