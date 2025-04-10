const Fastify = require('fastify');
const sensible = require('fastify-sensible');
const webSocketRoutes = require('./Infrastructure/routes/WebSocketRoutes');

const setup = () => {
    const app = Fastify({ logger: true });
    app.register(require('@fastify/websocket'));

    app.register(sensible);
    app.register(webSocketRoutes);

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
