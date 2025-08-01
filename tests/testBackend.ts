/* //This file contains both the exposed api to the client and the websocket endpoint
import Fastify from 'fastify'
import FastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors';
import { testLobbyRepository } from './testLobbyRepository.js'
import { InboundDTO, LobbyCreationConfigsDTO, OutboundDTO } from './dependencies/lobbyTyping.js';
import { WebSocket } from 'ws';
import { lobbySocketService } from './testLobbySocketService.js';

const fastify = Fastify()
fastify.register(FastifyWebsocket)
await fastify.register(cors); //This just allows a different domain to receive responses from this server

//IMPORTANT NOTE: For testing purposes, since the user is not authenticated, userID must be sent for identification of sender. 
//Which means that, for production, since it can be deduced from auth, it is not needed,
//THEREFORE IT MUST BE REMOVED (including from the frontend call!!)

//HTTP endpoints
fastify.get('/getAllLobbies', (_req, _res) => {
    return testLobbyRepository.getLobbiesList()
})
fastify.post('/createLobby', (req, _res) => {
    const dto = req.body as { 
        lobbySettings: LobbyCreationConfigsDTO,
        userID: number
    }
    const lobbyID = testLobbyRepository.createLobby(dto.lobbySettings, dto.userID)
    return { id: lobbyID }
})


//Websocket endpoint
fastify.register(async (fastify) => {
    fastify.get<{ Params: {lobbyID: string, userID: string} }> ('/ws/:lobbyID/:userID', {websocket: true}, (socket, req) => {
        
        const lobbyID: number = Number(req.params.lobbyID)
        const senderID: number = Number(req.params.userID)
        lobbySocketService.addSocketToLobby(lobbyID, senderID, socket);
        console.log(`connected! LobbyID: ${lobbyID}`)
        
        //Sends the entire Lobby back to client to it can initialize it from its side
        const lobby = testLobbyRepository.getLobbyByID(lobbyID)
        const dto: OutboundDTO = {
            requestType: "lobby",
            data: lobby
        };
        socket.send(JSON.stringify(dto));
        
        //Message handler
        socket.onmessage = (ev: WebSocket.MessageEvent) => {
            const dto: InboundDTO = JSON.parse(ev.data.toString()) as InboundDTO
            lobbySocketService.handleMessage(lobbyID, senderID, dto)
        }
        
        socket.onclose = (ev: WebSocket.CloseEvent) => {
            lobbySocketService.removeSocketFromLobby(lobbyID, senderID);
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
} */