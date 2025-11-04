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

    fastify.post('/friend_requests/add/:username', {
        preHandler: authMiddleware,
        handler: friendRequestController.createByUsername
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

    fastify.post('/friend_requests/:id/block', {
      preHandler: authMiddleware,
      handler: friendRequestController.blockFriend
    });

    fastify.post('/friend_requests/:username/blockbyusername', {
      preHandler: authMiddleware,
      handler: friendRequestController.blockByUsername
    });

    fastify.post('/friend_requests/:id/unblock', {
        preHandler: authMiddleware,
        handler: friendRequestController.unblockFriend
    });
    
    fastify.get('/friends', {
        preHandler: authMiddleware,
        handler: friendRequestController.getAllFriends
    });

    fastify.get('/block/state/:username', {
        preHandler: authMiddleware,
        handler: friendRequestController.isUserBlocked
    })

    fastify.get('/friend_requests/pending/count', {
        preHandler: authMiddleware,
        handler: friendRequestController.getPendingRequestsCount
    });

    fastify.get('/friend_requests/blocked', {
        preHandler: authMiddleware,
        handler: friendRequestController.getAllMyBlockedFriends
    });
}

module.exports = FriendRequestRoutes;