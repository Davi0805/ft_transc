const conversationService = require('../../../Application/Services/ConversationsService');

class ConversationsController {

    /* 
    *   @brief Return all conversations of an user
    *   GET - /conversations
    *   @returns a list of users conversations
    */
    async getAllMyConversations(req, reply)
    {
        const conversations = await conversationService.getAllMyConversations(req.session.user_id);
        return reply.send(conversations);
    }
}

module.exports = new ConversationsController();