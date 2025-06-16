const webSocketController = require('../../Adapters/inbound/webSocket/WebSocketController');

async function webSocketRoutes(fastify, options) {

    fastify.get('/ws', { websocket: true }, webSocketController.chat);
    
}

module.exports = webSocketRoutes;