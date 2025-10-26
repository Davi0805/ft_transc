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
const inputValid = require('./Infrastructure/config/InputValidator');

const prometheus = require('fastify-metrics');

const setup = () => {
    const app = Fastify({ logger: true,
        bodyLimit: 10 * 1024 * 1024,
        ajv: {
            customOptions: {
            allErrors: true,
            coerceTypes: false,
            useDefaults: true,
            removeAdditional: 'failing'
            }
        }
     });

     app.setErrorHandler((error, request, reply) => {
        const statusCode = error.statusCode ?? 500;
        console.log(error);

        reply.status(statusCode).send(
        {
            message: error.message,
            statusCode
        });
    });

    inputValid.setup(app);

    app.register(prometheus, {endpoint: '/metrics'});
    app.register(multer.contentParser);
    app.register(multerConfig);
    app.register(cors, {
        origin: '*'
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
