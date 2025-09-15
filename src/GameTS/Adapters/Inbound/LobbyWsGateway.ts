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
        if (!session) return;


        const lobbyID: number = Number(req.params.lobbyID);
        const userID: number = Number(session.user_id);
        const sprite_id: number = Number(session.sprite_id);
        const rating: number = Number(session.rating)
        if (isNaN(lobbyID) || isNaN(userID)) {return;} //TODO: probably return some error instead?

        if (lobbyService.isUserInAnotherMatch(lobbyID, userID)) {
            console.log("A user is trying to enter in a lobby while active in another match!")
            socket.close(1000, "The user is already active in another match");
            return;
        }
        lobbyService.addUser(lobbyID, userID, session.username, sprite_id, rating);
        socketService.addSocketToRepository(lobbyID, userID, socket);

        const dto: OutboundDTO = {
            requestType: "lobbyInit",
            data: lobbyService.getLobbyAndMatchInfoForClient(lobbyID, userID)
        };
        socket.send(JSON.stringify(dto));
        

        socket.onmessage = (ev: WebSocket.MessageEvent) => {
            const dto: InboundDTO = JSON.parse(ev.data.toString()) as InboundDTO //TODO: Maybe there should be a more robust casting
            socketService.handleMessage(lobbyID, userID, dto)
        }

        socket.onclose = (ev: WebSocket.CloseEvent) => {
            lobbyService.removeUser(lobbyID, userID);
            socketService.removeSocketFromRepository(userID);
            socket.close();
        }
    }
}

const lobbyWsGateway = new LobbyWsGateway();
export default lobbyWsGateway;