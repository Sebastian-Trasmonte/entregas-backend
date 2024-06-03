import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'set the environment', 'development');
program.parse();

const options = program.opts();

const env = options.mode;
dotenv.config({
    path: env === 'production' ? './.env.prod' : './.env.dev'
});

export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
    twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
    notification:NOTIFICATIONS
}