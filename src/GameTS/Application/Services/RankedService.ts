import type { LobbyT, LobbyUserT, RankedPlayerT } from "../Factories/LobbyFactory.js";
import { MatchMapT, MatchPlayerT } from "../Factories/MatchFactory.js";
import type { TMatchResult } from "../game/ServerGame.js";

import { getSlotsFromMap } from "../Factories/MatchFactory.js";

import lobbyService from "./LobbyService.js";
import matchService from "./MatchService.js";
import socketService from "./SocketService.js";


class RankedService {
    start(lobby: LobbyT, senderID: number) {
        const matchPlayers = this._getMatchPlayers(lobby.users);
        if (!this._areAllSlotsFull(lobby.matchSettings.map, matchPlayers)) {
            socketService.broadcastToUsers([senderID], "actionBlock", { reason: "notAllSlotsFilled" })
            return;
        }
        const matchID = matchService.createAndStartMatch(lobby.matchSettings, matchPlayers);

        const loop = () => {
            const matchResult = matchService.getMatchResultByID(matchID);
            if (matchResult) {
                this._onMatchFinished(lobby.id, matchID, matchResult, matchPlayers)
            } else {
                setTimeout(loop, 1 * 1000)
            }
        }
        loop()
    }

    _onMatchFinished(lobbyID: number, matchID: number, result: TMatchResult, players: MatchPlayerT[]) {
        matchService.updatePlayersRating(players, result);
        matchService.saveAndDestroyMatchByID(matchID, result);
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