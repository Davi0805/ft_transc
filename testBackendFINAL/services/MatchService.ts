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

        setTimeout(() => {
            match.startGameLoop()
        }, 5000)
        //match.startGameLoop();
        
        return matchID
    }

    stopMatchByID(matchID: number) {
        const matchLoop = matchRepository.getMatchBroadcastLoopByID(matchID);
        matchLoop.stop();
    }

    destroyMatchByID(matchID: number) {
        matchRepository.removeMatchByID(matchID)
    }

    updateControlsState(_lobbyID: number, senderID: number, controlsDTO: CGameDTO) {
        const match = matchRepository.getMatchByUserID(senderID);
        match.processClientDTO(controlsDTO);
    }

    getMatchResultByID(matchID: number) {
        const match = matchRepository.getMatchByID(matchID);
        return (match.matchResult);
    }
}

export const matchService = new MatchService()