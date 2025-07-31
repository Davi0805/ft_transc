const Fastify = require('fastify');
const sensible = require('@fastify/sensible');
const cors = require('@fastify/cors');
const path = require('path');
const matchRoutes = require('./Infrastructure/routes/MatchRoutes');
const lobbyRoutes = require('./Infrastructure/routes/LobbyRoutes');
const lobbyMatchWsGateRoutes = require('./Infrastructure/routes/LobbyMatchWsGatewayRoutes');

const prometheus = require('fastify-metrics');

const setup = () => {
    const app = Fastify({ logger: true,
        bodyLimit: 10 * 1024 * 1024
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

    app.register(require('@fastify/websocket'));
     
    app.register(prometheus, {endpoint: '/metrics'});
    app.register(cors, {
        origin: true
      });
    
    app.register(matchRoutes);
    app.register(lobbyRoutes);
    app.register(lobbyMatchWsGateRoutes);


    app.register(sensible);

    return app;
}

const run = () => {
    const app = setup();
    try {
        app.listen({ port: 8084, host: '0.0.0.0' });
        console.log("Listening...");
    } catch (error) {
        console.log("FATAL");
        process.exit(1);
    }
}

run();
