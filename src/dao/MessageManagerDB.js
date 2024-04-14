import messageModel from './models/messageModel.js'

export default class MessageManagerDB {
    addMessage = async (user, message) => {
        try {
            const result = await messageModel.create({
                user,
                message
            });
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error in add message");
        }
    }
    getAllMessages = async () => {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error obtaining messages`)
        }
    }
}