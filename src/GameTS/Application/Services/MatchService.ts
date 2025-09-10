import type { CGameDTO } from "../game/shared/dtos.js";
import type { MatchPlayerT, MatchSettingsT } from "../Factories/MatchFactory.js";
import type { TMatchResult } from "../game/ServerGame.js";
import userRepository, { UserT } from "../../Adapters/Outbound/UserRepository.js";

import matchFactory from "../Factories/MatchFactory.js";
import matchRepository from "../../Adapters/Outbound/MatchRepository.js";
import socketService from "./SocketService.js";
import ServerGame from "../game/ServerGame.js";

class MatchService {
    createAndStartMatch(matchSettings: MatchSettingsT, matchPlayers: MatchPlayerT[]) {
        const matchInfo = matchFactory.generateMatchInfo(matchSettings, matchPlayers)
        const match = matchFactory.create(matchInfo.serverConfigs, matchInfo.userIDs);
        matchRepository.add(match);

        socketService.broadcastToUsers(matchInfo.userIDs, "startMatch", { configs: matchInfo.clientConfigs });

        const matchID = match.id;
        this._startMatchGameLoop(matchID);
        this._startMatchBroadcastLoop(matchID);

        return matchID;
    }

    getMatchByID(matchID: number) {
        const matchInfo = matchRepository.getInfoByID(matchID);
        if (!matchInfo) { return null; };
        return matchInfo.match;
    }

    getMatchByUserID(userID: number): ServerGame | null {
        const matchInfo = matchRepository.getInfoByUserID(userID)
        if (!matchInfo) { return null }
        return matchInfo.match;
    }

    getMatchUsersByID(matchID: number) {
        const matchInfo = matchRepository.getInfoByID(matchID);
        if (!matchInfo) { return null; };
        return matchInfo.userIDs
    }

    getMatchBroadcastLoopByID(matchID: number) {
        const matchInfo = matchRepository.getInfoByID(matchID);
        if (!matchInfo) { return null; };
        return matchInfo.broadcastLoop;
    }

    destroyMatchByID(matchID: number) {
        matchRepository.removeByID(matchID)
    }

    stopMatchByID(matchID: number) {
        this._stopMatchBroadcastLoop(matchID);
        this._stopMatchGameLoop(matchID);
    }

    updateControlsState(_lobbyID: number, senderID: number, controlsDTO: CGameDTO) {
        const match = this.getMatchByUserID(senderID);
        if (match) {
            match.processClientDTO(controlsDTO);
        } else {
            console.log("Match does not exist. Ignoring client dto");
        }
    }

    getMatchResultByID(matchID: number) {
        const match = this.getMatchByID(matchID);
        if (!match) { throw Error("This match result does not exist in repo!")}
        return (match.matchResult);
    }

    updatePlayersRating(players: MatchPlayerT[], result: TMatchResult) {
        for (let player1I = 0; player1I < players.length; player1I++) {
            const user1 = userRepository.getUserByID(players[player1I].userID);
            for (let player2I = player1I + 1; player2I < players.length; player2I++) {
                const user2 = userRepository.getUserByID(players[player2I].userID);
                if (result[players[player1I].team] < result[players[player2I].team]) {
                    this._updateRatings(user1, user2);
                } else {
                    this._updateRatings(user2, user1);
                }
            }
            console.log(`the new rating of ${players[player1I].nickname} is ${user1.rating}`)
        }
    }


    private _startMatchBroadcastLoop(matchID: number) {
        const matchInfo = matchRepository.getInfoByID(matchID);
        if (!matchInfo) {throw Error("Match to start broadcastLoop is not present in repo!")};
        matchInfo.broadcastLoop.start(() => {
            if (!matchInfo.broadcastLoop.isRunning) return;
            const dto = matchInfo.match.getGameDTO();
            socketService.broadcastToUsers(matchInfo.userIDs, "updateGame", dto);
        })
    }
    private _stopMatchBroadcastLoop(matchID: number) {
        const matchBroadcastLoop = this.getMatchBroadcastLoopByID(matchID);
        if (!matchBroadcastLoop) {throw Error("Match to stop broadcastLoop is not present in repo!")};
        matchBroadcastLoop.stop();
    }
    private _startMatchGameLoop(matchID: number) {
        const match = this.getMatchByID(matchID);
        if (!match) { throw Error("Match to start is not present in repo!")}
        match.startGameLoop();
    }
    private _stopMatchGameLoop(matchID: number) {
        const match = this.getMatchByID(matchID);
        if (!match) { throw Error("Match just created is not present in repo!")}
        match.stopGameLoop();
    }


    private _updateRatings(winner: UserT, loser: UserT) {
        const winnerExpectedResult = this._getExpectedResult(winner.rating, loser.rating)
        const loserExpectedResult = 1 - winnerExpectedResult;
        const winnerK = winner.rating < 2400 ? 20 : 10;
        const loserK = loser.rating < 2400 ? 20 : 10;

        winner.rating += Math.round(winnerK * (1 - winnerExpectedResult));
        loser.rating += Math.round(loserK * (-loserExpectedResult));
    }

    private _getExpectedResult(ratingA: number, ratingB: number) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
    }
}

const matchService = new MatchService();
export default matchService;