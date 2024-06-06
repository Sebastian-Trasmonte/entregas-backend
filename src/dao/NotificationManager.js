import nodemailer from 'nodemailer';
import config from '../config/config.js';
import twilio from 'twilio';

export default class NotificationManager {

    constructor() {
        this.emails = [];
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email_user,
                pass: config.email_pass
            }
        });
    }

    sendEmail = async (info) => {
        const mailOptions = {
            from: {
                name: 'Notification of your purchase',
                address: 'notifications@purchase.com'
            },
            to: info.recipient,
            subject: info.subject,
            text: info.text
        };
        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + result.response);
        } catch (error) {
            console.error('Error sending email: ' + error);
        }
    }

    sendSMS = async (info) => {

        const client = twilio(config.twilio_account_sid, config.twilio_auth_token);

        try {
            await client.messages.create({
                body: info.text,
                to: info.recipient,
                from: config.twilio_phone_number
            });
            console.log('SMS sent');
        } catch (error) {
            console.error('Error sending SMS: ' + error);
        }
    }

}