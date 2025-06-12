const chatMessageRepo = require('../../Adapters/outbound/Repositories/ChatMessageRepository');

class ChatMessageService {

    async findAllByConversationId(conversation_id)
    {
        return await chatMessageRepo.findAllByConversationId(conversation_id);
    }

    async saveMessage(conversation_id, from_user_id, message_content)
    {
        await chatMessageRepo.saveMessage(conversation_id, from_user_id, message_content);
    }

    async setMessagesRead(conversation_id, user_id)
    {
        chatMessageRepo.setMessagesRead(conversation_id, user_id);
    }
}

module.exports = new ChatMessageService();