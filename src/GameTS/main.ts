import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyMetrics from 'fastify-metrics';
import fastifySensible from "@fastify/sensible";
import cors from '@fastify/cors';
import { lobbyRoutes } from "./Infrastructure/routes/LobbyRoutes.js";
import { LobbyWsGatewayRoutes } from "./Infrastructure/routes/LobbyWsRoutes.js";
import { leaderboardRoutes } from "./Infrastructure/routes/LeaderboardRoutes.js";
import { StatisticRoutes } from "./Infrastructure/routes/StatisticRoutes.js";
import { FastifyRequest, FastifyReply } from "fastify";
import process from "process";

const setup = () => {
    const fastify = Fastify({ 
        logger: true,
        bodyLimit: 10 * 1024 * 1024
    })

    fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
        const statusCode = error.statusCode ?? 500;
        console.log(error);

        reply.status(statusCode).send(
        {
            message: error.message ?? 'Unknown error',
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
    fastify.register(StatisticRoutes);


    return fastify;
}

const run = () => {
    const app = setup();
    try {
        app.listen({ port: 8084, host: '0.0.0.0' });
        console.log("Listening...");
    } catch (error: any) {
        console.error("FATAL: ", error.message ?? "Unknown error");
        process.exit(1);
    }
}

run();