import type { TMatchResult } from "../game/ServerGame.js";
import type { FriendlyPlayerT, LobbyT, LobbyUserT } from "../Repositories/LobbyRepository.js";
import type { MatchPlayerT } from "../Repositories/MatchRepository.js";
import { lobbyService } from "./LobbyService.js";
import { matchService } from "./MatchService.js";
import { socketService } from "./SocketService.js";

const CHECK_RESULT_FRQUENCY = 500 // in milliseconds

//The service responsible to run a friendly match
class FriendlyService {
    start(lobby: LobbyT, _senderID: number) {
        const matchPlayers = this._getMatchPlayers(lobby.users);
        //Contrary to a ranked match, no checking if the slots are full is necessary,
        // because they will be filled by bots
        const matchID = matchService.createAndStartMatch(lobby.matchSettings, matchPlayers);

        //The service pools the match result to check if it is finished
        const loop = () => {
            const matchResult = matchService.getMatchResultByID(matchID);
            if (matchResult) {
                this._onMatchFinished(lobby.id, matchID, matchResult, matchPlayers)
            } else {
                setTimeout(loop,  CHECK_RESULT_FRQUENCY)
            }
        }
        loop()
    }

    private _onMatchFinished(lobbyID: number, matchID: number, result: TMatchResult, players: MatchPlayerT[]) {
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