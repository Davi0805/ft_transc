import { matchFactory } from "../factories/matchFactory.js"
import { CGameDTO } from "../game/shared/dtos.js";
import { MatchPlayerT, matchRepository, MatchSettingsT } from "../Repositories/MatchRepository.js"
import { socketService } from "./SocketService.js";

class MatchService {
    createAndStartMatch(matchSettings: MatchSettingsT, matchPlayers: MatchPlayerT[]) {
        const matchInfo = matchFactory.generateMatchInfo(matchSettings, matchPlayers)
        
        const matchID = matchRepository.createMatch(matchInfo.serverConfigs, matchInfo.userIDs);

        socketService.broadcastToUsers(matchInfo.userIDs, "startMatch", { configs: matchInfo.clientConfigs });

        const match = matchRepository.getMatchByID(matchID);
        if (!match) { throw Error("Match just created is not present in repo!")}

        match.startGameLoop();
        
        return matchID
    }

    stopMatchByID(matchID: number) {
        const matchLoop = matchRepository.getMatchBroadcastLoopByID(matchID);
        if (!matchLoop) { throw Error("MatchLoop was not found in repo!")}
        matchLoop.stop();
    }

    destroyMatchByID(matchID: number) {
        matchRepository.removeMatchByID(matchID)
    }

    updateControlsState(_lobbyID: number, senderID: number, controlsDTO: CGameDTO) {
        const match = matchRepository.getMatchByUserID(senderID);
        if (match) {
            match.processClientDTO(controlsDTO);
        } else {
            console.log("Match does not exist. Ignoring client dto")
        }
    }

    getMatchResultByID(matchID: number) {
        const match = matchRepository.getMatchByID(matchID);
        if (!match) { throw Error("This match result does not exist in repo!")}
        return (match.matchResult);
    }
}

export const matchService = new MatchService()