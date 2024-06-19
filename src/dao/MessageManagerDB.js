import messageModel from './models/messageModel.js'
import { logger } from '../helpers/logger.js';

export default class MessageManagerDB {
    addMessage = async (user, message) => {
        try {
            const result = await messageModel.create({
                user,
                message
            });
            return result;
        } catch (error) {
            logger.error(error.message);
            throw new Error("Error in add message");
        }
    }
    getAllMessages = async () => {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            logger.error(error.message);
            throw new Error(`Error obtaining messages`)
        }
    }
}