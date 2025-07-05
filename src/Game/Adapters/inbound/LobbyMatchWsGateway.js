const lobbyRepo = require('../outbound/LobbyDataRepository');
const exception = require('../../Infrastructure/config/CustomException');
const redisService = require('../../Application/Services/RedisService');

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

        const lobbyData = await lobbyRepo.get(req.params.lobbyId);
        console.log('JSON = ' + JSON.stringify(lobbyData));
        if (Object.keys(lobbyData).length == 0) socket.close();

        lobbyRepo.addUser(req.params.lobbyId, {user_id: session.user_id});
        
    }

}

module.exports = new LobbyMatchWsGateway();