import type { FastifyRequest } from "fastify";
import type { WebSocket } from "ws";

import redisService from "./RedisService.js";



class WsAuth {

    async authenticate(req: FastifyRequest, socket: WebSocket)
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
        const session = await redisService.getSession('Bearer ' + token);
        if (!session) {
            console.log('Sessao nao encontrada!')
            socket.close();
            return;
        }
        return session;
    }
};

const wsAuth = new WsAuth();
export default wsAuth;