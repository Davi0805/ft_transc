//This file contains both the exposed api to the client and the websocket endpoint
import Fastify from 'fastify'
import FastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors';
import { WebSocket } from 'ws';
import { lobbyRepository } from './LobbyRepository.js';
import { InboundDTO, LobbyCreationConfigsDTO, OutboundDTO } from './dependencies/lobbyTyping.js';
import { socketService } from './SocketService.js';
import { lobbyService } from './LobbyService.js';

const fastify = Fastify()
fastify.register(FastifyWebsocket)
await fastify.register(cors); //This just allows a different domain to receive responses from this server

//IMPORTANT NOTE: For testing purposes, since the user is not authenticated, userID must be sent for identification of sender. 
//Which means that, for production, since it can be deduced from auth, it is not needed,
//THEREFORE IT MUST BE REMOVED (including from the frontend call!!)

//HTTP endpoints
fastify.get('/getAllLobbies', (_req, _res) => {
    console.log("Lobbies requested!")
    return lobbyRepository.getAllLobbies()
})
fastify.post('/createLobby', (req, _res) => {
    const dto = req.body as { 
        lobbySettings: LobbyCreationConfigsDTO,
        userID: number
    }
    const lobbyID = lobbyRepository.createLobby(dto.lobbySettings, dto.userID)
    console.log("lobby created!")
    return { id: lobbyID }
})


//Websocket endpoint
fastify.register(async (fastify) => {
    fastify.get<{ Params: {lobbyID: string, userID: string} }> ('/ws/:lobbyID/:userID', {websocket: true}, (socket, req) => {
        
        const lobbyID: number = Number(req.params.lobbyID)
        const senderID: number = Number(req.params.userID)
        //Adding the user first to the lobby and only then add the socket to the repository
        //Ensures that the addUser message is not broadcasted to the user who just got in
        lobbyService.addUser(lobbyID, senderID)
        socketService.addSocketToRepository(lobbyID, senderID, socket);
        
        console.log(`connected! LobbyID: ${lobbyID}`)
        
        //Sends the entire Lobby back to client to it can initialize it from its side
        const lobby = lobbyRepository.getLobbyByID(lobbyID)
        const dto: OutboundDTO = {
            requestType: "lobby",
            data: lobby
        };
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
    })
})


try {
    await fastify.listen({ port: 6969, host: '0.0.0.0'})
    console.log("server has started")
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}