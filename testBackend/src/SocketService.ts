import { WebSocket } from "ws";
import { InboundDTO, OutboundDTO, OutboundDTOMap } from "./dependencies/lobbyTyping.js";
import { socketRepository } from "./SocketRepository.js";
import { lobbyService } from "./LobbyService.js";

class SocketService {

    addSocketToRepository(lobbyID: number, senderID: number, socket: WebSocket) {
        socketRepository.addSocket(lobbyID, senderID, socket);
    }

    removeSocketFromRepository(userID: number) {
        socketRepository.removeSocketByUserID(userID);
    }

    broadcastToLobby<T extends keyof OutboundDTOMap>(lobbyID: number, reqType: T, data: OutboundDTOMap[T]) {
        const sockets = socketRepository.getSocketsByLobbyID(lobbyID);
        const dto: OutboundDTO = {
            requestType: reqType,
            data: data
        }
        const dtoString = JSON.stringify(dto);
        sockets.forEach(socket => {
            socket.send(dtoString)
        })
    }

    handleMessage(lobbyID: number, senderID: number, dto: InboundDTO) {
        switch (dto.requestType) {
            case "updateSettings":
                lobbyService.updateSettings(lobbyID, dto.data.settings)
                break;
            case "inviteUserToLobby":
                lobbyService.inviteUser(lobbyID, dto.data.userID);
                break;
            case "updateReadiness":
                lobbyService.updateReadiness(lobbyID, senderID, dto.data.ready);
                break;
            case "addFriendlyPlayer":
                lobbyService.addFriendlyPlayer(lobbyID, senderID, dto.data.player);
                break;
            case "removeFriendlyPlayer":
                lobbyService.removeFriendlyPlayer(lobbyID, senderID, dto.data.playerID);
                break;
            case "addRankedPlayer":
                lobbyService.addRankedPlayer(lobbyID, senderID, dto.data.player);
                break;
            case "removeRankedPlayer":
                lobbyService.removeRankedPlayer(lobbyID, senderID);
                break;
            case "addTournamentPlayer":
                lobbyService.addTournamentPlayer(lobbyID, senderID);
                break;
            case "removeTournamentPlayer":
                lobbyService.removeTournamentPlayer(lobbyID, senderID);
                break;
            default:
                throw Error("dto type not recognized!")
        }
    }

}

export const socketService = new SocketService()