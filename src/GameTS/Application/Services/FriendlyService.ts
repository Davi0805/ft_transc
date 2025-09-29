import type { TMatchResult } from "../game/ServerGame.js";
import type { FriendlyPlayerT, LobbyT, LobbyUserT } from "../Factories/LobbyFactory.js";
import type { MatchPlayerT } from "../Factories/MatchFactory.js";

import matchService from "./MatchService.js";
import socketService from "./SocketService.js";
import lobbyService from "./LobbyService.js";


const CHECK_RESULT_FRQUENCY = 500 // in milliseconds

//The service responsible to run a friendly match
class FriendlyService {
    start(lobby: LobbyT, _senderID: number) {
        const matchPlayers = this._getMatchPlayers(lobby.users);
        //Contrary to a ranked match, no checking if the slots are full is necessary,
        // because they will be filled by bots
        const matchID = matchService.createAndStartMatch(lobby.id, lobby.matchSettings, matchPlayers);

        //The service pools the match result to check if it is finished
        const loop = () => {
            const matchResult = matchService.getMatchResultByID(matchID);
            if (matchResult) {
                this._onMatchFinished(lobby.id, matchID, matchResult, matchPlayers)
            } else if (matchResult === null) {
                setTimeout(loop,  CHECK_RESULT_FRQUENCY)
            } else {
                console.log("The match being polled for result no longer extsts. Stopping poll");
            }
        }
        loop()
    }

    private _onMatchFinished(lobbyID: number, matchID: number, result: TMatchResult, players: MatchPlayerT[]) {
        matchService.destroyMatchByID(matchID);
        socketService.broadcastToLobby(lobbyID, "updateGame", {
            type: "GameResult",
            data: result
        })
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

const friendlyService = new FriendlyService();
export default friendlyService;