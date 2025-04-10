const friendRequestController = require('../../Adapters/inbound/http/FriendRequestController');

async function FriendRequestRoutes(fastify, options) {
    fastify.get('/friend_requests', friendRequestController.getAll); //debug
    fastify.post('/friend_requests', friendRequestController.create);
    
    fastify.get('/friend_requests/pending', friendRequestController.listPendingRequests);
    fastify.post('/friend_requests/:id/accept', friendRequestController.acceptRequest);
    fastify.post('/friend_requests/:id/reject', friendRequestController.rejectRequest);
    fastify.get('/friends', friendRequestController.getAllFriends);
}

module.exports = FriendRequestRoutes;