const Fastify = require('fastify');
const sensible = require('fastify-sensible');
const webSocketRoutes = require('./Infrastructure/routes/WebSocketRoutes');
const conversationRoutes = require('./Infrastructure/routes/ConversationRoutes');
const chatMessageRoutes = require('./Infrastructure/routes/ChatMessagesRoutes');

const consumeNewFriendsEvent = require('./Adapters/inbound/Redis Streams/streamsConsumer');

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

    app.register(sensible);
    app.register(webSocketRoutes);
    app.register(conversationRoutes);
    app.register(chatMessageRoutes);

    return app;
}

const run = () => {
    const app = setup();

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
