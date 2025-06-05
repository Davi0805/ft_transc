const Fastify = require('fastify');
const sensible = require('@fastify/sensible');
const cors = require('@fastify/cors');
const path = require('path');
const matchRoutes = require('./Infrastructure/routes/MatchRoutes');
const userCustomsRoutes = require('./Infrastructure/routes/UserCustomsRoutes');

const prometheus = require('fastify-metrics');

const setup = () => {
    const app = Fastify({ logger: true,
        bodyLimit: 10 * 1024 * 1024
     });
    app.register(prometheus, {endpoint: '/metrics'});
    app.register(cors, {
        origin: true
      });
    
    app.register(matchRoutes);
    app.register(userCustomsRoutes);
    app.register(sensible);

    return app;
}

const run = () => {
    const app = setup();
    try {
        app.listen({ port: 8082, host: '0.0.0.0' });
        console.log("Listening...");
    } catch (error) {
        console.log("FATAL");
        process.exit(1);
    }
}

run();
