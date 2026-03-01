import type { FastifyRequest } from "fastify";
import type { WebSocket } from "ws";
import dbConnection from "../../Adapters/Outbound/DbConnection.js";

import redisService from "./RedisService.js";



class StatisticService {

    async getStatistics(user_id: number)
    {
        return await dbConnection.getRecentMatches(user_id);
    }

    async getStatisticByUserId(user_id: number) {
        return await dbConnection.getPlayerStats(user_id);
    }
};

const statisticService = new StatisticService();
export default statisticService;