import { TMatchResult } from "../game/ServerGame.js";
import { LobbyT, LobbyUserT, RankedPlayerT } from "../Repositories/LobbyRepository.js";
import { MatchPlayerT } from "../Repositories/MatchRepository.js";
import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";

class RankedService {
    start(lobby: LobbyT) {
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
                const player = user.player as RankedPlayerT;
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