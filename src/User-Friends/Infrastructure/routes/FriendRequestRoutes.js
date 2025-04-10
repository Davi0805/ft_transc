const friendRequestController = require('../../Adapters/inbound/http/FriendRequestController');

async function FriendRequestRoutes(fastify, options) {
    fastify.get('/friend_requests', friendRequestController.getAll);
    fastify.post('/friend_requests', friendRequestController.create);
}

module.exports = FriendRequestRoutes;