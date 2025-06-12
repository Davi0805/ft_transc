const conversationService = require('../../../Application/Services/ConversationsService');

class ConversationsController {
    async getAllMyConversations(req, reply)
    {
        const conversations = await conversationService.getAllMyConversations(req.session.user_id);
        return reply.send(conversations);
    }
}

module.exports = new ConversationsController();