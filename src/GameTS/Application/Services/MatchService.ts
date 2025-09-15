import type { CGameDTO } from "../game/shared/dtos.js";
import type { MatchPlayerT, MatchSettingsT } from "../Factories/MatchFactory.js";
import type { TMatchResult } from "../game/ServerGame.js";

import matchFactory from "../Factories/MatchFactory.js";
import matchRepository from "../../Adapters/Outbound/MatchRepository.js";
import socketService from "./SocketService.js";
import ServerGame from "../game/ServerGame.js";
import userService from "./UserService.js";
import { SIDES } from "../game/shared/sharedTypes.js";
import { CAppConfigs } from "../game/shared/SetupDependencies.js";

class MatchService {
    createAndStartMatch(lobbyID: number, matchSettings: MatchSettingsT, matchPlayers: MatchPlayerT[]) {
        const matchInfo = matchFactory.generateMatchInfo(matchSettings, matchPlayers)
        const match = matchFactory.create(lobbyID, matchInfo);
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

    getMatchInfoByUserID(userID: number) {
        const matchInfo = matchRepository.getInfoByUserID(userID)
        if (!matchInfo) { return null }
        return matchInfo;
    }

    getMatchByUserID(userID: number): ServerGame | null {
        const matchInfo = matchRepository.getInfoByUserID(userID)
        if (!matchInfo) { return null }
        return matchInfo.match;
    }

    getMatchClientConfigsByUserID(userID: number) {
        const matchInfo = matchRepository.getInfoByUserID(userID)
        if (!matchInfo) { return null }
        return matchInfo.clientConfigs;
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

    async destroyMatchByID(matchID: number) {        
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
        const playerRatings = new Map<number, number>();
        const updatedRatings = new Map<number, number>();
        const teamToPlayerID = new Map<SIDES, number>();

        players.forEach(player => {
            const currentRating = userService.getUserRatingByID(player.id);
            playerRatings.set(player.id, currentRating);
            updatedRatings.set(player.id, currentRating);
            teamToPlayerID.set(player.team, player.id);
        })

        for (let i = 0; i < result.length - 1; i++) {
            for (let j = i + 1; j < result.length; j++) {
                const winnerID = teamToPlayerID.get(result[i]);
                const loserID = teamToPlayerID.get(result[j]);
                if (!winnerID || !loserID) {throw Error()}
                const winnerRating = playerRatings.get(winnerID);
                const loserRating = playerRatings.get(loserID);
                const updatedWinnerRating = updatedRatings.get(winnerID);
                const updatedLoserRating = updatedRatings.get(loserID);
                if (!winnerRating || !loserRating || !updatedWinnerRating || !updatedLoserRating) {
                    throw Error();
                }
                
                const ratingDiffs = this._getRatingChanges(winnerRating, loserRating);
                updatedRatings.set(winnerID, updatedWinnerRating + ratingDiffs.winnerRatingDiff);
                updatedRatings.set(loserID, updatedLoserRating + ratingDiffs.loserRatingDiff);
            }
        }

        updatedRatings.forEach((rating, id) => {userService.updateUserRating(id, rating)})
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


    private _getRatingChanges(winnerRating: number, loserRating: number) {
        const winnerExpectedResult = this._getExpectedResult(winnerRating, loserRating)
        const loserExpectedResult = 1 - winnerExpectedResult;
        const winnerK = winnerRating < 2400 ? 20 : 10;
        const loserK = loserRating < 2400 ? 20 : 10;
        const winnerRatingDiff = Math.round(winnerK * (1 - winnerExpectedResult));
        const loserRatingDiff = Math.round(loserK * (-loserExpectedResult));

        return {
            winnerRatingDiff: winnerRatingDiff,
            loserRatingDiff: loserRatingDiff
        }
    }

    private _getExpectedResult(ratingA: number, ratingB: number) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
    }
}

const matchService = new MatchService();
export default matchService;