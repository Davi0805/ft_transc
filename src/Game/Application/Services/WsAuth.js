const redisService = require('../../Application/Services/RedisService');

class WsAuth {

    async authenticate(req, socket)
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
        return session;
    }
};

module.exports = new WsAuth();