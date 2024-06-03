import EmailManager from "../dao/EmailManager";

export default class EmailController {
    constructor() {
        this.emailManager = new EmailManager();
    }

    async sendEmail(info) {
        //armar el email con la info que se recibe        
        return this.emailManager.sendEmail(info);
    }

    async sendSMS(info) {
        return this.emailManager.sendSMS(info);
    }
}