import type { FastifyReply, FastifyRequest } from "fastify";

import lobbyService from "../../Application/Services/LobbyService.js";
import { LobbyCreationConfigsT } from "../../Application/Factories/LobbyFactory.js";


class LobbyController {


    // todo: maybe later implement a builder pattern to lobby
    async createLobby(req: FastifyRequest, reply: FastifyReply)
    {
        const userID = Number(req.session.user_id) as number;
        if (lobbyService.isUserInAnotherMatch(-1, userID)) {
            return reply.send({ id: -1 }) //TODO: Should this be an http error?
        }

        const creationConfigs = req.body as LobbyCreationConfigsT;
        //TODO: Make extensive check of this.

        
        const lobbyID = await lobbyService.createLobby(creationConfigs, userID);
        return reply.send({ id: lobbyID });
    }

    /* async getLobby(req: FastifyRequest, reply: FastifyReply)
    {
        const lobby = await lobbyService.getLobbyById(req.params.lobbyId);
        return reply.send(lobby);
    } */

    async getLobbiesForDisplay(_req: FastifyRequest, reply: FastifyReply)
    {
        const lobbiesForDisplay = await lobbyService.getLobbiesForDisplay();
        return reply.send(lobbiesForDisplay);
    }

    // When i want to test something, i just put it here
    /* async debugEndpoint(req: FastifyRequest, reply: FastifyReply)
    {
        return await lobbyRepo.getLobbyToGameBuild(req.params.lobbyId);
    } */

}

const lobbyController = new LobbyController();
export default lobbyController;