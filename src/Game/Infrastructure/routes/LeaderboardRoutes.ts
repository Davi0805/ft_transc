import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import authMiddleware from "../config/AuthMiddleware.js";
import lobbyController from "../../Adapters/Inbound/LobbyController.js";
import leaderboardController from "../../Adapters/Inbound/LeaderboardController.js";

export async function leaderboardRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.get('/leaderboard', {
        handler: leaderboardController.getLeaderboard
    });

}

