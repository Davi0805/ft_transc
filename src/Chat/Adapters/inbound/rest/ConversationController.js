const conversationService = require('../../../Application/Services/ConversationsService');
const redisService = require('../../../Application/Services/RedisService');

class ConversationsController {
    async getAllMyConversations(req, reply)
    {
        const session = JSON.parse(await redisService.getSession((req.headers.authorization)));
        if (!session)
            return reply.code(400).send();
        const conversations = await conversationService.getAllMyConversations(session.user_id);
        const returnConversations = conversations.map(conv => ({
            id: conv.id,
            friend_id: session.user_id == conv.user1_id ? conv.user2_id : conv.user1_id
        }));

        return reply.send(returnConversations);
    }
}

module.exports = new ConversationsController();