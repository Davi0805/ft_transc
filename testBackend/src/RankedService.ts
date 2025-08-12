import { TFriendlyPlayer, TLobby, TLobbyUser, TMatchPlayer, TMatchResult, TRankedPlayer } from "./dependencies/lobbyTyping.js"
import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";

class RankedService {
    start(lobby: TLobby) {
        const matchPlayers = this._getMatchPlayers(lobby.users);
        matchService.createAndRunMatch(lobby, matchPlayers);
    }

    onMatchFinished(lobbyID: number, _matchID: number, result: TMatchResult) {
        socketService.broadcastToLobby(lobbyID, "endOfMatch", { result: result })
        setTimeout(() => {
            lobbyService.returnToLobby(lobbyID);
        }, 10 * 1000)
    }


    private _getMatchPlayers(users: TLobbyUser[]) {
        const out: TMatchPlayer[] = [];
        users.forEach(user => {
            if (user.player) {
                const player = user.player as TRankedPlayer;
                out.push({
                    userID: user.id,
                    id: user.id,
                    nickname: user.username,
                    spriteID: user.spriteID,
                    team: player.team,
                    role: player.role,
                })
            }
        })
        return out
    }
}

export const rankedService = new RankedService()