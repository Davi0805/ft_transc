const lobbyRepo = require('../outbound/LobbyDataRepository');
const exception = require('../../Infrastructure/config/CustomException');
const redisService = require('../../Application/Services/RedisService');
const msgHandler = require('../../Application/Services/MessageHandler');
const connectedUsersRepository = require('../outbound/ConnectedUsersRepository');
const lobbyMapper = require('../../Infrastructure/Mappers/LobbyMapper');
const lobbyService = require('../../Application/Services/LobbyService');
const wsAuth = require('../../Application/Services/WsAuth');

class LobbyMatchWsGateway {

    async join(socket, req)
    {
        const session = await wsAuth.authenticate(req, socket);
        if (!session) return;

        await lobbyService.validateLobbyEntry(req.params.lobbyId, socket);
        lobbyService.addUserToLobby(req.params.lobbyId, session.user_id, socket);

        socket.on('message', async message => {
            msgHandler.process(message, req.params.lobbyId, session.user_id);
        });

        socket.on('close', async () => {
            lobbyService.removeUserFromLobby(req.params.lobbyId, session.user_id);
        })
    }

}

module.exports = new LobbyMatchWsGateway();