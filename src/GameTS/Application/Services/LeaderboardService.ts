import type { FastifyRequest } from "fastify";
import type { WebSocket } from "ws";
import dbConnection from "../../Adapters/Outbound/DbConnection.js";

import redisService from "./RedisService.js";



class LeaderboardService {

    async getLeaderboard()
    {
        return dbConnection.getMatchesLeaderboard();
    }

};

const leaderboardService = new LeaderboardService();
export default leaderboardService;