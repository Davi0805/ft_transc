import Fastify from 'fastify';
import FastifyWebsocket from '@fastify/websocket';
import cors from '@fastify/cors';
import { testLobbyRepository } from './testLobbyRepository.js';
import { lobbySocketService } from './testLobbySocketService.js';
const fastify = Fastify();
fastify.register(FastifyWebsocket);
await fastify.register(cors); //This just allows a different domain to receive responses from this server
fastify.get('/getAllLobbies', (_req, _res) => {
    return testLobbyRepository.getLobbiesList();
});
fastify.post('/createLobby', (req, _res) => {
    const dto = req.body;
    return testLobbyRepository.createLobby(dto.lobbySettings, dto.selfData);
});
fastify.register(async (fastify) => {
    fastify.get('/ws/:lobbyID', { websocket: true }, (socket, req) => {
        const lobbyID = Number(req.params.lobbyID);
        lobbySocketService.addSocket(socket);
        socket.onopen = () => {
            console.log(`connected! LobbyID: ${lobbyID}`);
        };
        socket.onmessage = (ev) => {
            const dto = JSON.parse(ev.data.toString());
            console.log(`Message received: ${dto}`);
            switch (dto.requestType) {
                case "updateSettings":
                    lobbySocketService.updateSettings(lobbyID, dto.data.settings);
                    break;
                default:
                    throw Error("dto type not found!");
            }
            lobbySocketService;
        };
    });
});
try {
    await fastify.listen({ port: 6969, host: '127.0.0.1' });
    console.log("server has started");
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
