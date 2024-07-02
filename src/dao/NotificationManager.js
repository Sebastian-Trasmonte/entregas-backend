import nodemailer from 'nodemailer';
import config from '../config/config.js';
import twilio from 'twilio';
import { logger } from '../helpers/logger.js';

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
                name: info.title,
                address: 'notifications@purchase.com'
            },
            to: info.recipient,
            subject: info.subject,
            text: info.text
        };
        try {
            const result = await this.transporter.sendMail(mailOptions);
            logger.info('Email sent: ' + result.response);
        } catch (error) {
            logger.error('Error sending email: ' + error);
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
            logger.info('SMS sent');
        } catch (error) {
            logger.error('Error sending SMS: ' + error);
        }
    }

}