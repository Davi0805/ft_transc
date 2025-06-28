const lobbyRepo = require('../outbound/LobbyDataRepository');

class LobbyController {


    // todo: maybe later implement a builder pattern to lobby
    async createLobby(req, reply)
    {
        const body = req.body;
        const id = Math.floor(Math.random() * 99999);

        console.log('Lobby Id = ' + id + ' | Lobby Body = ' + JSON.stringify(req.body));
        await lobbyRepo.save(id,
                {name: body.name, type: body.type,
                 mode: body.mode, duration: body.duration,
                 map: body.map, map_usr_min: 0,
                 map_usr_max: 0});
        return reply.send({lobby_id: id});
    }

    async getLobby(req, reply)
    {
        const data = await lobbyRepo.get(req.params.lobbyId);
        return reply.send(data);
    }

    async getAllLobbies(req, reply)
    {
        const data = await lobbyRepo.getAllLobbies();
        return reply.send(data);
    }

}

module.exports = new LobbyController();