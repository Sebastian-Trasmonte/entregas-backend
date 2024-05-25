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
    client_secret: process.env.CLIENT_SECRET
}