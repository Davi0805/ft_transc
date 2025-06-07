const conversationsController = require('../../Adapters/inbound/rest/ConversationController');
const authMiddleware = require('../config/AuthMiddleware');

async function ConversationRoutes(fastify, options) {
    fastify.get('/conversations', {
        preHandler: authMiddleware,
        handler: conversationsController.getAllMyConversations
      });

}

module.exports = ConversationRoutes;