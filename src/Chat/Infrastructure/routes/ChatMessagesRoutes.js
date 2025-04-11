const chatMessageController = require('../../Adapters/inbound/rest/ChatMessagesController');

async function chatMessageRoutes(fastify, options) {
    fastify.get('/messages/:conversation_id', chatMessageController.getMessagesByConversationId);
}

module.exports = chatMessageRoutes;