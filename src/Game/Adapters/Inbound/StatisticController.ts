import type { FastifyReply, FastifyRequest } from "fastify";

import lobbyService from "../../Application/Services/LobbyService.js";
import { LobbyCreationConfigsT } from "../../Application/Factories/LobbyFactory.js";
import leaderboardService from "../../Application/Services/LeaderboardService.js";
import statisticService from "../../Application/Services/StatisticService.js";


class StatisticController {

    async getMyMatchHistory(req: FastifyRequest, reply: FastifyReply)
    {
        const stats = await statisticService.getStatistics(Number(req.session.user_id));
        return stats;
    }

    async getHistoryByUserId(req: FastifyRequest, reply: FastifyReply)
    {
        const params = req.params as { user_id: string };
        const stats = await statisticService.getStatistics(Number(params.user_id));
        return stats;
    }

    async getStatisticByUserId(req: FastifyRequest, reply: FastifyReply)
    {
        const params = req.params as { user_id: string };
        const stats = await statisticService.getStatisticByUserId(Number(params.user_id));
        return stats;
    }
}

const statisticController = new StatisticController();
export default statisticController;