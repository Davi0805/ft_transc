const Fastify = require('fastify');
const sensible = require('fastify-sensible');
const webSocketRoutes = require('./Infrastructure/routes/WebSocketRoutes');
const conversationRoutes = require('./Infrastructure/routes/ConversationRoutes');
const chatMessageRoutes = require('./Infrastructure/routes/ChatMessagesRoutes');

const setup = () => {
    const app = Fastify({ logger: true });
    app.register(require('@fastify/websocket'));

    app.register(sensible);
    app.register(webSocketRoutes);
    app.register(conversationRoutes);
    app.register(chatMessageRoutes);

    return app;
}

const run = () => {
    const app = setup();
    try {
        app.listen({ port: 8081, host: '0.0.0.0' });
        console.log("Listening...");
    } catch (error) {
        console.log("FATAL");
        process.exit(1);
    }
}

run();
