import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";
import { getSlotsFromMap } from "../factories/matchFactory.js";
class RankedService {
    start(lobby, senderID) {
        const matchPlayers = this._getMatchPlayers(lobby.users);
        if (!this._areAllSlotsFull(lobby.matchSettings.map, matchPlayers)) {
            socketService.broadcastToUsers([senderID], "actionBlock", { reason: "notAllSlotsFilled" });
            return;
        }
        const matchID = matchService.createAndStartMatch(lobby.matchSettings, matchPlayers);
        const loop = () => {
            const matchResult = matchService.getMatchResultByID(matchID);
            if (matchResult) {
                this._onMatchFinished(lobby.id, matchID, matchResult, matchPlayers);
            }
            else {
                setTimeout(loop, 1 * 1000);
            }
        };
        loop();
    }
    _onMatchFinished(lobbyID, matchID, result, players) {
        matchService.updatePlayersRating(players, result);
        matchService.destroyMatchByID(matchID);
        socketService.broadcastToLobby(lobbyID, "endOfMatch", { result: result });
        setTimeout(() => {
            lobbyService.returnToLobby(lobbyID);
        }, 10 * 1000);
    }
    _getMatchPlayers(users) {
        const out = [];
        users.forEach(user => {
            if (user.player) {
                const player = user.player;
                out.push({
                    userID: user.id,
                    id: user.id,
                    nickname: user.username,
                    spriteID: user.spriteID,
                    team: player.team,
                    role: player.role,
                });
            }
        });
        return out;
    }
    _areAllSlotsFull(map, players) {
        let availableSlots = getSlotsFromMap(map);
        players.forEach(player => {
            availableSlots = availableSlots.filter(slot => slot.team !== player.team || slot.role !== player.role);
        });
        return availableSlots.length === 0;
    }
}
export const rankedService = new RankedService();
