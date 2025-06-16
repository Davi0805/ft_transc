const chatMessageService = require('../../../Application/Services/ChatMessageService');
const conversationService = require('../../../Application/Services/ConversationsService');
const exception = require('../../../Infrastructure/config/CustomException');

class ChatMessageController {

    /* 
    *   @brief Return messages related to a conversation
    *   GET - /messages/{id}
    *   @params {id} - conversation_id
    *   @returns a list of messages
    */
    async getMessagesByConversationId(req, reply)
    {
        const conversation_id = req.params.conversation_id;
        const conv = await conversationService.getConversationById(conversation_id);
        if (!conv[0] || conv[0].user1 != req.session.user_id && conv[0].user2 != req.session.user_id)
            throw exception('User is not part of conversation', 400);
        const messages = await chatMessageService.findAllByConversationId(conversation_id);
        chatMessageService.setMessagesRead(conversation_id, req.session.user_id);
        return reply.send(messages);
    }
}

module.exports = new ChatMessageController();