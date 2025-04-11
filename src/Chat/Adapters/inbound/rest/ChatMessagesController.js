const chatMessageService = require('../../../Application/Services/ChatMessageService');
const redisService = require('../../../Application/Services/RedisService');


class ChatMessageController {

    async getMessagesByConversationId(req, reply)
    {
        const conversation_id = req.params.conversation_id;
        const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
        if (!session)
            return reply.code(400).send();
        const messages = JSON.stringify(await chatMessageService.findAllByConversationId(conversation_id));
        return reply.send(messages);
    }
}

module.exports = new ChatMessageController();