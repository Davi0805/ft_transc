const Fastify = require('fastify');
const userRoutes = require('./Infrastructure/routes/UserRoutes');
const friendRequestRoutes = require('./Infrastructure/routes/FriendRequestRoutes');
const sensible = require('fastify-sensible');
const consumeFriendsCacheEvent = require('./Adapters/inbound/Redis Streams/FriendsCacheConsumer');


const setup = () => {
    const app = Fastify({ logger: true });

    app.register(userRoutes);
    app.register(friendRequestRoutes);
    app.register(sensible);

    return app;
}

const run = () => {
    const app = setup();
    consumeFriendsCacheEvent();
    try {
        app.listen({ port: 8080, host: '0.0.0.0' });
        console.log("Listening...");
    } catch (error) {
        console.log("FATAL");
        process.exit(1);
    }
}

run();
