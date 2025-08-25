import { TMatchResult } from "../game/ServerGame.js";
import { FriendlyPlayerT, LobbyT, LobbyUserT } from "../Repositories/LobbyRepository.js";
import { MatchPlayerT } from "../Repositories/MatchRepository.js";
import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";

class FriendlyService {
    start(lobby: LobbyT, _senderID: number) {

        const matchPlayers = this._getMatchPlayers(lobby.users);
        const matchID = matchService.createAndStartMatch(lobby.matchSettings, matchPlayers);

        const loop = () => {
            const matchResult = matchService.getMatchResultByID(matchID);
            if (matchResult) {
                this._onMatchFinished(lobby.id, matchID, matchResult)
            } else {
                setTimeout(loop, 1 * 1000)
            }
        }
        loop()
    }

    _onMatchFinished(lobbyID: number, matchID: number, result: TMatchResult) {
        matchService.destroyMatchByID(matchID);
        socketService.broadcastToLobby(lobbyID, "endOfMatch", { result: result })
        setTimeout(() => {
            
            lobbyService.returnToLobby(lobbyID);
        }, 10 * 1000)
    }


    private _getMatchPlayers(users: LobbyUserT[]) {
        const out: MatchPlayerT[] = [];
        users.forEach(user => {
            if (user.player) {
                const players = user.player as FriendlyPlayerT[]
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