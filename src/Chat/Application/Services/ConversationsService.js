const conversationsRepo = require('../../Adapters/outbound/Repositories/ConversationsRepository');

class ConversationService {

    async save(user1, user2)
    {
        await conversationsRepo.save(user1, user2);
    }

    async getAllMyConversations(user_id)
    {
        return await conversationsRepo.getAllMyConversations(user_id);
    }
}

module.exports = new ConversationService();