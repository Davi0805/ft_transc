import { WebSocket } from "ws";
import { socketRepository } from "../../Adapters/Outbound/SocketRepository.js";
import lobbyService from "./LobbyService.js";
import { InboundDTO, OutboundDTO, OutboundDTOMap } from "../../dtos.js";
import matchService from "./MatchService.js";



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

    broadcastToUsers<T extends keyof OutboundDTOMap>(userIDs: number[], reqType: T, data: OutboundDTOMap[T]) {
        const sockets = socketRepository.getSocketsByUserIDs(userIDs);
        this._broadcastToSockets(sockets, reqType, data)
    }

    private _broadcastToSockets<T extends keyof OutboundDTOMap>(sockets: WebSocket[], reqType: T, data: OutboundDTOMap[T]) {
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
        //It would be much better to save these in an object for a more data-driven approach
        // But because I am a complete ignorant, I do not know the best way to type the function
        // (either anonymous which calls the funcs or converting the actual signatures to accept the data directly
        // and type the value as a reference to those funcs directly), I will keep it like this lol
        switch (dto.requestType) {
            case "updateSettings":
                lobbyService.updateSettings(lobbyID, senderID, dto.data.settings);
                break;
            case "inviteUserToLobby":
                console.log("Invite user to lobby not implemented yet") //TODO
                break;
            case "updateReadiness":
                lobbyService.updateUserReadinesss(lobbyID, senderID, dto.data.ready);
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
            case "start":
                lobbyService.start(lobbyID, senderID);
                break;
            case "updateGame":
                matchService.updateControlsState(lobbyID, senderID, dto.data)
                break;
            default:
                console.log(`Socket does not recognize the request type`)
        }
    }

}

const socketService = new SocketService();
export default socketService;