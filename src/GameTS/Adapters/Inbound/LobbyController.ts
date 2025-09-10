import type { FastifyReply, FastifyRequest } from "fastify";

import lobbyService from "../../Application/Services/LobbyService.js";


class LobbyController {


    // todo: maybe later implement a builder pattern to lobby
    /* async createLobby(req: FastifyRequest, reply: FastifyReply)
    {
        const lobby = await lobbyService.createLobby(req.body, req.session.user_id);
        return reply.send(lobby);
    } */

    /* async getLobby(req: FastifyRequest, reply: FastifyReply)
    {
        const lobby = await lobbyService.getLobbyById(req.params.lobbyId);
        return reply.send(lobby);
    } */

    async getLobbiesForDisplay(_req: FastifyRequest, reply: FastifyReply)
    {
        console.log("This shit was called!");
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