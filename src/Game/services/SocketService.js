import { socketRepository } from "../Repositories/SocketRepository.js";
import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
class SocketService {
    addSocketToRepository(lobbyID, senderID, socket) {
        socketRepository.addSocket(lobbyID, senderID, socket);
    }
    removeSocketFromRepository(userID) {
        socketRepository.removeSocketByUserID(userID);
    }
    broadcastToLobby(lobbyID, reqType, data) {
        const sockets = socketRepository.getSocketsByLobbyID(lobbyID);
        const dto = {
            requestType: reqType,
            data: data
        };
        const dtoString = JSON.stringify(dto);
        sockets.forEach(socket => {
            socket.send(dtoString);
        });
    }
    broadcastToUsers(userIDs, reqType, data) {
        const sockets = socketRepository.getSocketsByUserIDs(userIDs);
        this._broadcastToSockets(sockets, reqType, data);
    }
    _broadcastToSockets(sockets, reqType, data) {
        const dto = {
            requestType: reqType,
            data: data
        };
        const dtoString = JSON.stringify(dto);
        sockets.forEach(socket => {
            socket.send(dtoString);
        });
    }
    handleMessage(lobbyID, senderID, dto) {
        //It would be much better to save these in an object for a more data-driven approach
        // But because I am a complete ignorant, I do not know the best way to type the function
        // (either anonymous which calls the funcs or converting the actual signatures to accept the data directly
        // and type the value as a reference to those funcs directly), I will keep it like this lol
        switch (dto.requestType) {
            case "updateSettings":
                lobbyService.updateSettings(lobbyID, senderID, dto.data.settings);
                break;
            case "inviteUserToLobby":
                console.log("Invite user to lobby not implemented yet"); //TODO
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
                matchService.updateControlsState(lobbyID, senderID, dto.data);
                break;
            default:
                console.log(`Socket does not recognize the request type`);
        }
    }
}
export const socketService = new SocketService();
