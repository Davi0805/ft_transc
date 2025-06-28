const lobbyController = require('../../Adapters/inbound/LobbyController');

async function lobbyRoutes(fastify, options) {
    fastify.post('/lobby', lobbyController.createLobby);
    fastify.get('/lobby/:lobbyId', lobbyController.getLobby);
    fastify.get('/lobby', lobbyController.getAllLobbies);
}

module.exports = lobbyRoutes;