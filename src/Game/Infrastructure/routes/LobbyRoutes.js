const lobbyController = require('../../Adapters/inbound/LobbyController');
const authMiddleware = require('../../Infrastructure/config/AuthMiddleware');

async function lobbyRoutes(fastify, options) {
    fastify.post('/lobby', {
        preHandler: authMiddleware,
        handler: lobbyController.createLobby 
    });

    fastify.get('/lobby/:lobbyId', {
        preHandler: authMiddleware,
        handler: lobbyController.getLobby 
    });
    
    fastify.get('/lobby', {
        preHandler: authMiddleware,
        handler: lobbyController.getAllLobbies 
    });

    fastify.get('/debug/:lobbyId', lobbyController.debugEndpoint);
}

module.exports = lobbyRoutes;