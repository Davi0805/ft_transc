import type { CGameDTO } from "../game/shared/dtos.js";
import { matchFactory } from "../factories/matchFactory.js"
import { matchRepository, MatchPlayerT, MatchSettingsT } from "../Repositories/MatchRepository.js"
import { socketService } from "./SocketService.js";
import { TMatchResult } from "../game/ServerGame.js";
import { userRepository, UserT } from "../Repositories/UserRepository.js";

class MatchService {
    createAndStartMatch(matchSettings: MatchSettingsT, matchPlayers: MatchPlayerT[]) {
        const matchInfo = matchFactory.generateMatchInfo(matchSettings, matchPlayers)
        const matchID = matchRepository.createMatch(matchInfo.serverConfigs, matchInfo.userIDs);

        socketService.broadcastToUsers(matchInfo.userIDs, "startMatch", { configs: matchInfo.clientConfigs });

        this._startMatchGameLoop(matchID);
        this._startMatchBroadcastLoop(matchID);

        return matchID;
    }

    destroyMatchByID(matchID: number) {
        matchRepository.removeMatchByID(matchID)
    }

    stopMatchByID(matchID: number) {
        this._stopMatchBroadcastLoop(matchID);
        this._stopMatchGameLoop(matchID);
    }

    updateControlsState(_lobbyID: number, senderID: number, controlsDTO: CGameDTO) {
        const match = matchRepository.getMatchByUserID(senderID);
        if (match) {
            match.processClientDTO(controlsDTO);
        } else {
            console.log("Match does not exist. Ignoring client dto");
        }
    }

    getMatchResultByID(matchID: number) {
        const match = matchRepository.getMatchByID(matchID);
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
        }
    }


    private _startMatchBroadcastLoop(matchID: number) {
        const matchInfo = matchRepository.getMatchInfoByID(matchID);
        if (!matchInfo) {throw Error("Match to start broadcastLoop is not present in repo!")};
        matchInfo.broadcastLoop.start(() => {
            if (!matchInfo.broadcastLoop.isRunning) return;
            const dto = matchInfo.match.getGameDTO();
            socketService.broadcastToUsers(matchInfo.userIDs, "updateGame", dto);
        })
    }
    private _stopMatchBroadcastLoop(matchID: number) {
        const matchBroadcastLoop = matchRepository.getMatchBroadcastLoopByID(matchID);
        if (!matchBroadcastLoop) {throw Error("Match to stop broadcastLoop is not present in repo!")};
        matchBroadcastLoop.stop();
    }
    private _startMatchGameLoop(matchID: number) {
        const match = matchRepository.getMatchByID(matchID);
        if (!match) { throw Error("Match to start is not present in repo!")}
        match.startGameLoop();
    }
    private _stopMatchGameLoop(matchID: number) {
        const match = matchRepository.getMatchByID(matchID);
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

export const matchService = new MatchService()