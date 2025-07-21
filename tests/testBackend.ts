import Fastify from 'fastify'
import FastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors';
import { testLobbyRepository } from './testLobbyRepository.js'
import { InboundDTO, LobbyCreationConfigsDTO } from './dependencies/lobbyTyping.js';
import { WebSocket } from 'ws';
import { lobbySocketService } from './testLobbySocketService.js';

const fastify = Fastify()
fastify.register(FastifyWebsocket)
await fastify.register(cors); //This just allows a different domain to receive responses from this server

fastify.get('/getAllLobbies', (_req, _res) => {
    return testLobbyRepository.getLobbiesList()
})
fastify.post<{ Params: {lobbyID: string} }>('/enterLobby/:lobbyID', (req, _res) => {
    const lobbyID = Number(req.params.lobbyID)
    const selfData = req.body as { id: number, username: string }
    testLobbyRepository.addUserToLobby(lobbyID, selfData)
    const lobby = testLobbyRepository.getLobbyByID(lobbyID)
    return lobby
})
fastify.post('/createLobby', (req, _res) => {
    const dto = req.body as { 
        lobbySettings: LobbyCreationConfigsDTO,
        selfData: { id: number, username: string }
    }
    return testLobbyRepository.createLobby(dto.lobbySettings, dto.selfData)
})



fastify.register(async (fastify) => {
    fastify.get<{ Params: {lobbyID: string, userID: string} }> ('/ws/:lobbyID/:userID', {websocket: true}, (socket, req) => {
        const lobbyID: number = Number(req.params.lobbyID)
        const senderID: number = Number(req.params.userID)
        lobbySocketService.addSocketToLobby(lobbyID, senderID, socket);

        socket.onopen = () => {
            console.log(`connected! LobbyID: ${lobbyID}`)
        }

        socket.onmessage = (ev: WebSocket.MessageEvent) => {
            const dto: InboundDTO = JSON.parse(ev.data.toString()) as InboundDTO
            console.log(`Message received: ${dto}`)
            lobbySocketService.handleMessage(lobbyID, senderID, dto)
        }
    })
})


try {
    await fastify.listen({ port: 6969, host: '127.0.0.1'})
    console.log("server has started")
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}