const conversationsRepo = require('../../Adapters/outbound/Repositories/ConversationsRepository');

class ConversationService {

    async save(user1, user2)
    {
        return await conversationsRepo.save(user1, user2);
    }

    async getAllMyConversations(user_id)
    {
        return await conversationsRepo.getAllConversationsAndUnread(user_id);
    }

    async getConversationById(conversation_id)
    {
        return await conversationsRepo.getConversationById(conversation_id);
    }
}

module.exports = new ConversationService();