const Fastify = require('fastify');
const userRoutes = require('./Infrastructure/routes/UserRoutes');
const friendRequestRoutes = require('./Infrastructure/routes/FriendRequestRoutes');
const sensible = require('@fastify/sensible');
const consumeFriendsCacheEvent = require('./Adapters/inbound/Redis Streams/FriendsCacheConsumer');
const multer = require('fastify-multer');
const multerConfig = require('./Infrastructure/config/MulterConfig');
const cors = require('@fastify/cors');
const fastifyStatic = require('@fastify/static');
const path = require('path');

const setup = () => {
    const app = Fastify({ logger: true,
        bodyLimit: 10 * 1024 * 1024
     });

    app.register(multer.contentParser);
    app.register(multerConfig);
    app.register(cors, {
        origin: true
      });

      app.register(fastifyStatic, {
        root: path.join(__dirname, 'uploads'),
        prefix: '/static/'
    });

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
