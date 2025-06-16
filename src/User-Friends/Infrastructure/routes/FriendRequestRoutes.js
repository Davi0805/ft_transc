const friendRequestController = require('../../Adapters/inbound/http/FriendRequestController');
const authMiddleware = require('../config/AuthMiddleware');

async function FriendRequestRoutes(fastify, options) {
    fastify.get('/friend_requests', friendRequestController.getAll); //debug
    fastify.post('/friend_requests', {
        schema: {
          body: { $ref: 'createFriendReq#' }
        },
        preHandler: authMiddleware,
        handler: friendRequestController.create
      });
    
    fastify.get('/friend_requests/pending', {
        preHandler: authMiddleware,
        handler: friendRequestController.listPendingRequests
      });
    
    fastify.post('/friend_requests/:id/accept', {
        preHandler: authMiddleware,
        handler: friendRequestController.acceptRequest
      });
    
    fastify.post('/friend_requests/:id/reject', {
        preHandler: authMiddleware,
        handler: friendRequestController.rejectRequest
      });
    
    fastify.get('/friends', {
        preHandler: authMiddleware,
        handler: friendRequestController.getAllFriends
      });
}

module.exports = FriendRequestRoutes;