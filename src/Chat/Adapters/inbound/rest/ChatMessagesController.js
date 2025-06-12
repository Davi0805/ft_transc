const chatMessageService = require('../../../Application/Services/ChatMessageService');


class ChatMessageController {

    async getMessagesByConversationId(req, reply)
    {
        // todo: check if the conversation_id have this user on it
        const conversation_id = req.params.conversation_id;
        const messages = JSON.stringify(await chatMessageService.findAllByConversationId(conversation_id));
        return reply.send(messages);
    }
}

module.exports = new ChatMessageController();