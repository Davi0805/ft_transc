import type { FastifyReply, FastifyRequest } from "fastify";

import lobbyRepository from "../Outbound/LobbyRepository.js";
import matchRepository from "../Outbound/MatchRepository.js";
import { tournamentRepository } from "../Outbound/TournamentRepository.js";


class AdminController {

    async deleteAllRepos(req: FastifyRequest, reply: FastifyReply) {
        lobbyRepository.removeAll();
        matchRepository.removeAll();
        tournamentRepository.removeAll();
        console.log("DeleteAllRepos was successfully run!")
    }
}

const adminController = new AdminController();
export default adminController;