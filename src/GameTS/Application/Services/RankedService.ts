import type { LobbyT, LobbyUserT, RankedPlayerT } from "../Factories/LobbyFactory.js";
import { MatchMapT, MatchPlayerT } from "../Factories/MatchFactory.js";
import type { TMatchResult } from "../game/ServerGame.js";

import { getSlotsFromMap } from "../Factories/MatchFactory.js";

import lobbyService from "./LobbyService.js";
import matchService from "./MatchService.js";
import socketService from "./SocketService.js";
import dbConnection from "../../Adapters/Outbound/DbConnection.js";

const CHECK_RESULT_FRQUENCY = 500 // in milliseconds

class RankedService {
    start(lobby: LobbyT, senderID: number): boolean {
        const matchPlayers = this._getMatchPlayers(lobby.users);
        if (!this._areAllSlotsFull(lobby.matchSettings.map, matchPlayers)) {
            socketService.broadcastToUsers([senderID], "actionBlock", { reason: "notAllSlotsFilled" })
            return false;
        }
        const matchID = matchService.createAndStartMatch(lobby.id, lobby.matchSettings, matchPlayers);

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
        return true;
    }

    async _onMatchFinished(lobbyID: number, matchID: number, result: TMatchResult, players: MatchPlayerT[]) {
        const dbMatchID = await dbConnection.saveMatch(result);
        players.forEach(player => dbConnection.savePlayerMatch(player.id, player.team, dbMatchID));
        matchService.updatePlayersRating(players, result);

        const endSceneConfigs = matchService.buildEndSceneConfigsFromMatchID(matchID, result);
        matchService.destroyMatchByID(matchID);
        socketService.broadcastToLobby(lobbyID, "updateGame", {
            type: "GameResult",
            data: endSceneConfigs
        })
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

    private _areAllSlotsFull(map: MatchMapT, players: MatchPlayerT[]): boolean {
        let availableSlots = getSlotsFromMap(map);
        players.forEach(player => {
            availableSlots = availableSlots.filter(slot => slot.team !== player.team || slot.role !== player.role)
        })
        return availableSlots.length === 0;
    }
}

const rankedService = new RankedService();
export default rankedService;