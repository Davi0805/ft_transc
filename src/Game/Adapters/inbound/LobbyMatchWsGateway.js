const lobbyRepo = require('../outbound/LobbyDataRepository');
const exception = require('../../Infrastructure/config/CustomException');
const redisService = require('../../Application/Services/RedisService');
const msgHandler = require('../../Application/Services/MessageHandler');
const connectedUsersRepository = require('../outbound/ConnectedUsersRepository');

class LobbyMatchWsGateway {


    async join(socket, req)
    {
        let token = null;
        const protocols = req.headers['sec-websocket-protocol'];
        if (protocols) {
            // protocols is a comma-separated string
            const protocolArr = protocols.split(',').map(p => p.trim());
            const bearerProtocol = protocolArr.find(p => p.startsWith('Bearer.'));
            if (bearerProtocol) {
                token = bearerProtocol.split('Bearer.')[1];
            }
        }
        if (!token) {
            socket.close();
            return;
        }
        const session = JSON.parse(await redisService.getSession('Bearer ' + token));
        if (!session) {
            console.log('Sessao nao encontrada!')
            socket.close();
            return;
        }

        let lobbyData = await lobbyRepo.get(req.params.lobbyId);
        console.log('JSON = ' + JSON.stringify(lobbyData));
        if (Object.keys(lobbyData).length == 0) socket.close();
        lobbyData = await lobbyRepo.addUser(req.params.lobbyId, {user_id: session.user_id});
        connectedUsersRepository.addUser(req.params.lobbyId, session.user_id, socket);

        const tlobby = await lobbyRepo.getLobbyToGameBuild(req.params.lobbyId)
        const users = lobbyData.users


        const dto = {
            requestType: "joinLobby",
            data: {
                lobby: tlobby,
                users: users
            }
        }
        socket.send(JSON.stringify(dto));

        socket.on('message', async message => {
            msgHandler.process(message, req.params.lobbyId, session.user_id);
        });

        // please decouple this after cause this is really ugly code
        socket.on('close', async () => {
            connectedUsersRepository.deleteUser(req.params.lobbyId, session.user_id);
            connectedUsersRepository.broadcastToLobby(req.params.lobbyId, {type: "user_left_event",
                                                                        user_id: session.user_id});
        })
    }

}

module.exports = new LobbyMatchWsGateway();