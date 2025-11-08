import Fastify from "fastify"
import fastifyWebsocket from "@fastify/websocket";
import fastifyMetrics from 'fastify-metrics'
import fastifySensible from "@fastify/sensible";
import cors from '@fastify/cors';
import { lobbyRoutes } from "./Infrastructure/routes/LobbyRoutes.js";
import { LobbyWsGatewayRoutes } from "./Infrastructure/routes/LobbyWsRoutes.js";
import { leaderboardRoutes } from "./Infrastructure/routes/LeaderboardRoutes.js";

const setup = () => {
    const fastify = Fastify({ 
        logger: true,
        bodyLimit: 10 * 1024 * 1024
    })

    fastify.setErrorHandler((error, request, reply) => {
        const statusCode = error.statusCode ?? 500;
        console.log(error);

        reply.status(statusCode).send(
        {
            message: error.message,
            statusCode
        });
    });

    fastify.register(fastifyWebsocket);
    fastify.register(fastifyMetrics.default, {endpoint: '/metrics'}) //Must check if this works
    fastify.register(cors, {
        origin: true
    })
    fastify.register(fastifySensible);

    fastify.register(lobbyRoutes);
    fastify.register(LobbyWsGatewayRoutes);
    fastify.register(leaderboardRoutes);


    return fastify;
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