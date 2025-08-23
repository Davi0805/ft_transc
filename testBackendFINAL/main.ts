import Fastify from 'fastify'
import FastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors';
import { WebSocket } from 'ws';
import { LobbyCreationConfigsT, lobbyRepository, LobbyTypeT } from './Repositories/LobbyRepository.js';
import { lobbyService } from './services/LobbyService.js';
import { socketService } from './services/SocketService.js';
import { InboundDTO, OutboundDTO } from './dtos.js';

const fastify = Fastify()
fastify.register(FastifyWebsocket)
await fastify.register(cors);


fastify.get('/getAllLobbies', (_req, _res) => {
    console.log("Lobbies requested!")
    return lobbyRepository.getAllLobbiesForDisplay()
})


fastify.post('/createLobby', (req, _res) => {
    const dto = req.body as { 
        lobbySettings: LobbyCreationConfigsT,
        userID: number
    }
    const lobbyID = lobbyRepository.createLobby(dto.lobbySettings, dto.userID)
    console.log("lobby created!")
    return { id: lobbyID }
})

fastify.register(async (fastify) => {
    fastify.get<{ Params: {lobbyID: string, userID: string} }> (
        '/ws/:lobbyID/:userID', { websocket: true }, (socket, req) => {
            const lobbyID: number = Number(req.params.lobbyID)
            const senderID: number = Number(req.params.userID)

            lobbyService.addUser(lobbyID, senderID);
            socketService.addSocketToRepository(lobbyID, senderID, socket)

            console.log(`connected! LobbyID: ${lobbyID}`)
        
            //Sends the entire Lobby back to client to it can initialize it from its side
            const lobby = lobbyRepository.getLobbyByID(lobbyID)
            const dto: OutboundDTO = {
                requestType: "lobby",
                data: lobby
            };
            console.log(lobby)
            socket.send(JSON.stringify(dto));
            
            //Message handler
            socket.onmessage = (ev: WebSocket.MessageEvent) => {
                const dto: InboundDTO = JSON.parse(ev.data.toString()) as InboundDTO
                socketService.handleMessage(lobbyID, senderID, dto)
            }
            
            socket.onclose = (ev: WebSocket.CloseEvent) => {
                
                socketService.removeSocketFromRepository(senderID);
                socket.close();
            }
        }
    )
})

try {
    await fastify.listen({ port: 6969, host: '0.0.0.0'})
    console.log("server has started")
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}