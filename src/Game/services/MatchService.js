import { matchFactory } from "../factories/matchFactory.js";
import { matchRepository } from "../Repositories/MatchRepository.js";
import { socketService } from "./SocketService.js";
import { userRepository } from "../Repositories/UserRepository.js";
class MatchService {
    createAndStartMatch(matchSettings, matchPlayers) {
        const matchInfo = matchFactory.generateMatchInfo(matchSettings, matchPlayers);
        const matchID = matchRepository.createMatch(matchInfo.serverConfigs, matchInfo.userIDs);
        socketService.broadcastToUsers(matchInfo.userIDs, "startMatch", { configs: matchInfo.clientConfigs });
        this._startMatchGameLoop(matchID);
        this._startMatchBroadcastLoop(matchID);
        return matchID;
    }
    destroyMatchByID(matchID) {
        matchRepository.removeMatchByID(matchID);
    }
    stopMatchByID(matchID) {
        this._stopMatchBroadcastLoop(matchID);
        this._stopMatchGameLoop(matchID);
    }
    updateControlsState(_lobbyID, senderID, controlsDTO) {
        const match = matchRepository.getMatchByUserID(senderID);
        if (match) {
            match.processClientDTO(controlsDTO);
        }
        else {
            console.log("Match does not exist. Ignoring client dto");
        }
    }
    getMatchResultByID(matchID) {
        const match = matchRepository.getMatchByID(matchID);
        if (!match) {
            throw Error("This match result does not exist in repo!");
        }
        return (match.matchResult);
    }
    updatePlayersRating(players, result) {
        for (let player1I = 0; player1I < players.length; player1I++) {
            const user1 = userRepository.getUserByID(players[player1I].userID);
            for (let player2I = player1I + 1; player2I < players.length; player2I++) {
                const user2 = userRepository.getUserByID(players[player2I].userID);
                if (result[players[player1I].team] < result[players[player2I].team]) {
                    this._updateRatings(user1, user2);
                }
                else {
                    this._updateRatings(user2, user1);
                }
            }
            console.log(`the new rating of ${players[player1I].nickname} is ${user1.rating}`);
        }
    }
    _startMatchBroadcastLoop(matchID) {
        const matchInfo = matchRepository.getMatchInfoByID(matchID);
        if (!matchInfo) {
            throw Error("Match to start broadcastLoop is not present in repo!");
        }
        ;
        matchInfo.broadcastLoop.start(() => {
            if (!matchInfo.broadcastLoop.isRunning)
                return;
            const dto = matchInfo.match.getGameDTO();
            socketService.broadcastToUsers(matchInfo.userIDs, "updateGame", dto);
        });
    }
    _stopMatchBroadcastLoop(matchID) {
        const matchBroadcastLoop = matchRepository.getMatchBroadcastLoopByID(matchID);
        if (!matchBroadcastLoop) {
            throw Error("Match to stop broadcastLoop is not present in repo!");
        }
        ;
        matchBroadcastLoop.stop();
    }
    _startMatchGameLoop(matchID) {
        const match = matchRepository.getMatchByID(matchID);
        if (!match) {
            throw Error("Match to start is not present in repo!");
        }
        match.startGameLoop();
    }
    _stopMatchGameLoop(matchID) {
        const match = matchRepository.getMatchByID(matchID);
        if (!match) {
            throw Error("Match just created is not present in repo!");
        }
        match.stopGameLoop();
    }
    _updateRatings(winner, loser) {
        const winnerExpectedResult = this._getExpectedResult(winner.rating, loser.rating);
        const loserExpectedResult = 1 - winnerExpectedResult;
        const winnerK = winner.rating < 2400 ? 20 : 10;
        const loserK = loser.rating < 2400 ? 20 : 10;
        winner.rating += Math.round(winnerK * (1 - winnerExpectedResult));
        loser.rating += Math.round(loserK * (-loserExpectedResult));
    }
    _getExpectedResult(ratingA, ratingB) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }
}
export const matchService = new MatchService();
