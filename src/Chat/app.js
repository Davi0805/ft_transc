const Fastify = require('fastify');
const sensible = require('@fastify/sensible');
const webSocketRoutes = require('./Infrastructure/routes/WebSocketRoutes');
const conversationRoutes = require('./Infrastructure/routes/ConversationRoutes');
const chatMessageRoutes = require('./Infrastructure/routes/ChatMessagesRoutes');
const cors = require('@fastify/cors');
const onlineUserService = require('./Application/Services/OnlineUserService');
const consumeNewFriendsEvent = require('./Adapters/inbound/Redis Streams/streamsConsumer');
const eventBroadcast = require('./Adapters/inbound/Redis pub-sub/EventBroadcast');

const setup = () => {
    const app = Fastify({ logger: true });
    
    app.setErrorHandler((error, request, reply) => {
        const statusCode = error.statusCode ?? 500;
        console.log(error);

        reply.status(statusCode).send(
        {
            message: error.message,
            statusCode
        });
    });

    app.register(require('@fastify/websocket'));

    eventBroadcast.subscribe('realTimeNotif', eventBroadcast.handleRealTimeNotif);
    eventBroadcast.subscribe('lobbyInvites', eventBroadcast.handleLobbyInvitations);

    app.register(sensible);
    app.register(webSocketRoutes);
    app.register(conversationRoutes);
    app.register(chatMessageRoutes);
    app.register(cors, {
        origin: true
    });
    return app;
}

const run = () => {
    const app = setup();
    onlineUserService.onlineUserEventLoop();
    /* onlineUserService.broadcastOnlineFriends(); */
    consumeNewFriendsEvent();

    try {
        app.listen({ port: 8081, host: '0.0.0.0' });
        console.log("Listening...");
    } catch (error) {
        console.log("FATAL");
        process.exit(1);
    }
}

run();
