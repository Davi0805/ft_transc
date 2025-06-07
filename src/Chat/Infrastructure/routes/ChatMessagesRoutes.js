const chatMessageController = require('../../Adapters/inbound/rest/ChatMessagesController');
const authMiddleware = require('../config/AuthMiddleware');

async function chatMessageRoutes(fastify, options) {
    fastify.get('/messages/:conversation_id', {
        preHandler: authMiddleware,
        handler: chatMessageController.getMessagesByConversationId
      });
}

module.exports = chatMessageRoutes;