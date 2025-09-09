import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import authMiddleware from "../config/AuthMiddleware.js";
import lobbyController from "../../Adapters/Inbound/LobbyController.js";


export async function lobbyRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.get('/lobby', {
        preHandler: authMiddleware,
        handler: lobbyController.getAllLobbies 
    });
}
