const conversationsController = require('../../Adapters/inbound/rest/ConversationController');

async function ConversationRoutes(fastify, options) {
    fastify.get('/conversations', conversationsController.getAllMyConversations);

}

module.exports = ConversationRoutes;