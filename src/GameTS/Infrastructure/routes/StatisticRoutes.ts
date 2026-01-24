import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import authMiddleware from "../config/AuthMiddleware.js";
import statisticController from "../../Adapters/Inbound/StatisticController.js";

export async function StatisticRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.get('/stats/history', {
        preHandler: authMiddleware,
        handler: statisticController.getMyMatchHistory
    });

    fastify.get('/stats/history/:user_id', {
        preHandler: authMiddleware,
        handler: statisticController.getHistoryByUserId
    });

    fastify.get('/stats/:user_id', {
        preHandler: authMiddleware,
        handler: statisticController.getStatisticByUserId
    });
}

