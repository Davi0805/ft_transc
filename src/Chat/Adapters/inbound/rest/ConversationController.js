const conversationService = require('../../../Application/Services/ConversationsService');
const redisService = require('../../../Application/Services/RedisService');

class ConversationsController {
    async getAllMyConversations(req, reply)
    {
        const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
        if (!session)
            return reply.code(400).send();
        const conversations = await conversationService.getAllMyConversations(session.user_id);
        return reply.send(conversations);
    }
}

module.exports = new ConversationsController();