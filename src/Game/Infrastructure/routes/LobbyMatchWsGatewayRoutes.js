const lobbyMatchGateway = require('../../Adapters/inbound/LobbyMatchWsGateway');

async function LobbyMatchWsGatewayRoutes(fastify, options) {
    fastify.get('/ws/:lobbyId', {websocket: true}, lobbyMatchGateway.join);
}

module.exports = LobbyMatchWsGatewayRoutes;