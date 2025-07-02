const lobbyRepo = require('../outbound/LobbyDataRepository');
const exception = require('../../Infrastructure/config/CustomException');

class LobbyMatchWsGateway {


    async join(socket, req)
    {
        const lobbyData = await lobbyRepo.get(req.params.lobbyId);
        console.log('JSON = ' + JSON.stringify(lobbyData));
        if (Object.keys(lobbyData).length == 0) socket.close();

        lobbyRepo.addUser(req.params.lobbyId, {});
        
    }

}

module.exports = new LobbyMatchWsGateway();