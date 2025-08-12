import { CGameDTO } from "./dependencies/dtos.js";
import { TLobby, TLobbyType, TMatchPlayer } from "./dependencies/lobbyTyping.js";
import { friendlyService } from "./FriendlyService.js";
import LoopController from "./game/LoopController.js";
import { SIDES } from "./game/shared/sharedTypes.js";
import { matchFactory } from "./MatchFactory.js";
import { matchRepository } from "./MatchRepository.js";
import { socketService } from "./SocketService.js";

class MatchService {
    createAndRunMatch(lobby: TLobby, matchPlayers: TMatchPlayer[]) {
        const match = matchFactory.create(lobby, matchPlayers);
        matchRepository.addMatch(match)

        socketService.broadcastToLobby(lobby.id, "startMatch", { configs: match.clientSettings });
        const game = match.serverGame;
        const loop = new LoopController(60);
        loop.start(() => {
            if (!loop.isRunning) return;
            const dto = game.getGameDTO()
            socketService.broadcastToUsers(match.userIDs, "updateGame", dto);
            
            if (game.matchResult !== null) {
                loop.stop();
                console.log(`The result of the match with id ${match.id} was: `, game.matchResult)
                switch (lobby.type) {
                    case "friendly":
                        friendlyService.onMatchFinished(lobby.id, match.id, game.matchResult);
                        matchRepository.removeMatchByID(match.id)
                }
            }
        })
        game.startGameLoop();
    }

    updateControlsState(_lobbyID: number, senderID: number, controlsDTO: CGameDTO) {
        const match = matchRepository.getMatchByUserID(senderID);
        match.serverGame.processClientDTO(controlsDTO);
    }
}

export const matchService = new MatchService()