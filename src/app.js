const Fastify = require('fastify');
const userRoutes = require('./routes/UserRoutes');
const sensible = require('fastify-sensible');

const setup = () => {
    const app = Fastify({ logger: true });

    app.register(userRoutes);
    app.register(sensible);

    return app;
}

const run = () => {
    const app = setup();
    try {
        app.listen({ port: 8080, host: '0.0.0.0' });
        console.log("Listening...");
    } catch (error) {
        console.log("FATAL");
        process.exit(1);
    }
}

run();
