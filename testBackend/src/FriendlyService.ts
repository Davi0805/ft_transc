import { TFriendlyPlayer, TLobby, TLobbyUser, TMatchPlayer, TMatchResult } from "./dependencies/lobbyTyping.js"
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";

class FriendlyService {
    start(lobby: TLobby) {
        const matchPlayers = this._getFriendlyPlayers(lobby.users);
        matchService.createAndRunMatch(lobby, matchPlayers);
    }

    onMatchFinished(lobbyID: number, _matchID: number, result: TMatchResult) {
        socketService.broadcastToLobby(lobbyID, "endOfMatch", { result: result })
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