const lobbyRepo = require('../outbound/LobbyDataRepository');
const mapRepo = require('../outbound/MapRepository');
const lobbyService = require('../../Application/Services/LobbyService');

class LobbyController {


    // todo: maybe later implement a builder pattern to lobby
    async createLobby(req, reply)
    {
        const lobby = await lobbyService.createLobby(req.body, req.session.user_id);
        return reply.send(lobby);
    }

    async getLobby(req, reply)
    {
        const lobby = await lobbyService.getLobbyById(req.params.lobbyId);
        return reply.send(lobby);
    }

    async getAllLobbies(req, reply)
    {
        const lobby = await lobbyService.getAllLobbies();
        return reply.send(lobby);
    }

    // When i want to test something, i just put it here
    async debugEndpoint(req, reply)
    {
        return await lobbyRepo.getLobbyToGameBuild(req.params.lobbyId);
    }

}

module.exports = new LobbyController();