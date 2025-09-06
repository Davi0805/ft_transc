import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";
const CHECK_RESULT_FRQUENCY = 500; // in milliseconds
//The service responsible to run a friendly match
class FriendlyService {
    start(lobby, _senderID) {
        const matchPlayers = this._getMatchPlayers(lobby.users);
        //Contrary to a ranked match, no checking if the slots are full is necessary,
        // because they will be filled by bots
        const matchID = matchService.createAndStartMatch(lobby.matchSettings, matchPlayers);
        //The service pools the match result to check if it is finished
        const loop = () => {
            const matchResult = matchService.getMatchResultByID(matchID);
            if (matchResult) {
                this._onMatchFinished(lobby.id, matchID, matchResult, matchPlayers);
            }
            else {
                setTimeout(loop, CHECK_RESULT_FRQUENCY);
            }
        };
        loop();
    }
    _onMatchFinished(lobbyID, matchID, result, players) {
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
                const players = user.player;
                players.forEach(player => {
                    out.push({
                        userID: user.id,
                        id: player.id,
                        nickname: player.nickname,
                        spriteID: player.spriteID,
                        team: player.team,
                        role: player.role,
                    });
                });
            }
        });
        return out;
    }
}
export const friendlyService = new FriendlyService();
