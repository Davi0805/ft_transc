import type { FastifyRequest } from "fastify";
import type { WebSocket } from "ws";
import type { InboundDTO, OutboundDTO } from "../../dtos.js";

import wsAuth from "../../Application/Services/WsAuth.js";
import lobbyService from "../../Application/Services/LobbyService.js";
import socketService from "../../Application/Services/SocketService.js";


class LobbyWsGateway {
    async join(socket: WebSocket, req: FastifyRequest<{ Params: {lobbyID: string}}>)
    {
        const session = await wsAuth.authenticate(req, socket);
        if (!session) {
            socket.close(1008, "The authorization token was not recognized");
            return;
        }



        const lobbyID: number = Number(req.params.lobbyID);
        const userID: number = Number(session.user_id);
        const sprite_id: number = Number(session.sprite_id);
        const rating: number = Number(session.rating)
        if (isNaN(lobbyID)) {
            socket.close(1008, "The lobbyID to join is invalid");
            return;
        }
        
        if (lobbyService.isUserInAnotherMatch(lobbyID, userID)) {
            socket.close(4001, "The user is already active in another match");
            return;
        } else if (
            lobbyService.isLobbyWithActiveEvent(lobbyID)
            && !lobbyService.isUserInActiveLobbyEvent(lobbyID, userID)
        ) {
            socket.close(4001, "You cannot enter in this lobby because it has an event active and you are not part of it!");
            return;
        }

        if (!socketService.isUserConnected(userID)) {
            socket.close(4001, "The user already have another connection with game service");
            return ;
        }

        lobbyService.addUser(lobbyID, userID, session.username, sprite_id, rating);
        socketService.addSocketToRepository(lobbyID, userID, socket);

        const lobbyInfo = lobbyService.getLobbyInfoForClient(lobbyID, userID);
        const dto: OutboundDTO = {
            requestType: "lobbyInit",
            data: lobbyInfo
        };
        socket.send(JSON.stringify(dto));
        
        socket.onmessage = (ev: WebSocket.MessageEvent) => {
            const dto: InboundDTO = JSON.parse(ev.data.toString()) as InboundDTO //TODO: Maybe there should be a more robust casting
            socketService.handleMessage(lobbyID, userID, dto)
        }

        socket.onclose = (ev: WebSocket.CloseEvent) => {
            lobbyService.removeUser(lobbyID, userID);
            socketService.removeSocketFromRepository(userID);
        }
    }
}

const lobbyWsGateway = new LobbyWsGateway();
export default lobbyWsGateway;