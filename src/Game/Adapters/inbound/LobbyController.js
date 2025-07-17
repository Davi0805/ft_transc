const lobbyRepo = require('../outbound/LobbyDataRepository');
const mapRepo = require('../outbound/MapRepository');

class LobbyController {


    // todo: maybe later implement a builder pattern to lobby
    async createLobby(req, reply)
    {
        const body = req.body;
        const id = Math.floor(Math.random() * 99999);

        
        console.log('Lobby Id = ' + id + ' | Lobby Body = ' + JSON.stringify(body));


        console.log("----------------------------------\n\n\n\n\n\n")
        console.log(body);
        console.log(body.map);
        console.log("----------------------------------\n\n\n\n\n\n")
        const map_data = await mapRepo.getByName(body.map);

        console.log(JSON.stringify(map_data));

        await lobbyRepo.save(id,
                {name: body.name, type: body.type,
                 mode: body.mode, duration: body.duration,
                 map: body.map,
                 slots_taken: 0,
                 map_usr_max: map_data[0].max_slots,
                round: 0});
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

    // When i want to test something, i just put it here
    async debugEndpoint(req, reply)
    {
        return await lobbyRepo.getLobbyToGameBuild(req.params.lobbyId);
    }

}

module.exports = new LobbyController();