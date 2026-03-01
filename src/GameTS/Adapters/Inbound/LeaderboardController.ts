import type { FastifyReply, FastifyRequest } from "fastify";

import lobbyService from "../../Application/Services/LobbyService.js";
import { LobbyCreationConfigsT } from "../../Application/Factories/LobbyFactory.js";
import leaderboardService from "../../Application/Services/LeaderboardService.js";


class LeaderboardController {

    async getLeaderboard(req: FastifyRequest, reply: FastifyReply)
    {
        const leaderboard = leaderboardService.getLeaderboard() 
        return leaderboard;
    }
}

const leaderboardController = new LeaderboardController();
export default leaderboardController;