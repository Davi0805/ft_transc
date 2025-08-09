import { TFriendlyPlayer, TLobby, TLobbyUser, TMatchPlayer, TMatchResult } from "./dependencies/lobbyTyping.js"
import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";

class FriendlyService {
    start(lobby: TLobby) {
        const matchPlayers = this._getFriendlyPlayers(lobby.users);
        matchService.createAndRunMatch(lobby, matchPlayers);
    }

    onMatchFinished(lobbyID: number, _matchID: number, result: TMatchResult) {
        socketService.broadcastToLobby(lobbyID, "endOfMatch", { result: result })
        setTimeout(() => {
            lobbyService.returnToLobby(lobbyID);
        }, 10 * 1000)
    }


    private _getFriendlyPlayers(users: TLobbyUser[]) {
        const out: TMatchPlayer[] = [];
        users.forEach(user => {
            if (user.player) {
                const players = user.player as TFriendlyPlayer[]
                players.forEach(player => {
                    out.push({
                        userID: user.id,
                        id: player.id,
                        nickname: player.nickname,
                        spriteID: player.spriteID,
                        team: player.team,
                        role: player.role,
                    })
                })
            }
        })
        return out
    }
}

export const friendlyService = new FriendlyService()