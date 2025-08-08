import { WebSocket } from "ws";
import { CGameDTO } from "./dependencies/dtos.js";
import { TDuration, TMap, TLobby, TLobbyType, TFriendlyPlayer, TRankedPlayer, TTournamentPlayer, TTournamentParticipant, TMatchPlayer, TLobbyUser, OutboundDTO} from "./dependencies/lobbyTyping.js"
import ServerGame from "./game/ServerGame.js";
import { TUserCustoms, TGameConfigs, TControls, CAppConfigs } from "./game/shared/SetupDependencies.js"
import { point, SIDES, ROLES, TWindow, TPaddle } from "./game/shared/sharedTypes.js"
import { lobbySocketService } from "./testLobbySocketService.js";
import { Pairing, tournamentService, TournamentService } from "./TournamentService.cjs";
import LoopController from "./game/LoopController.js";
import { testMatchRepository } from "./testGameService.js";

type TMatch = TLobbyUser[];

export type SGameConfigs = {
    window: Pick<TWindow, "size">,
    matchLength: number
    teams: {
        side: SIDES,
        score: number
    }[]
    humans: {
        id: number,
        paddleID: number,
    }[]
    bots: {
        paddleID: number,
        difficulty: number
    }[],
    paddles: Pick<TPaddle, "id" | "side" | "size" | "pos" | "speed">[]
}

class TestMatchService {
    constructor(){}

    startMatch(lobbySettings: TLobby, participants: TMatch) {
        const matchPlayers = this._getMatchPlayers(participants, lobbySettings.type)
        const matchInfo = testMatchRepository.loadMatch(lobbySettings, matchPlayers)
        if (!matchInfo) {throw Error("Something went wrong creating this match!")}

        lobbySocketService.broadcastToUsers(matchInfo.userIDs, "startMatch", { configs: matchInfo.clientSettings })
        
        const game = matchInfo.serverGame
        const loop = new LoopController(60);
        loop.start(() => {
            const dto = game.getGameDTO()
            lobbySocketService.broadcastToUsers(matchInfo.userIDs, "updateGame", dto);
            
            if (game.matchResult !== null) {
                loop.pause();
                console.log(`The result of the match with id ${matchInfo.id} was: `, game.matchResult)
            }
        })
        game.startGameLoop();


        /* if (lobbySettings.type !== "tournament") {
            this._runMatch(lobbySettings, lobbySettings.users)
        } else {
            tournamentService.participants = this._getTournPlayers(lobbySettings.users); //USE THIS FROM NOW ON, SO EVEN IF PLAYERS EXIT TOURNAMENT, INFO IS STILL SAVED
            this._displayStandings(lobbySettings, tournamentService.participants)
        } */
    }

    


    
    private _currentMatchID: number = 0;
    private _currentMatches: {
        id: number
        game: ServerGame,
        playerIDs: number[] 
    }[] = []

    _getTournPlayers(users: TLobbyUser[]): TTournamentParticipant[] {
        const out: TTournamentParticipant[] = [];
        users.forEach(user => {
            const player = user.player as TTournamentPlayer;
            out.push({
                id: user.id,
                nick: user.username,
                score: player.score,
                rating: user.rating,
                prevOpponents: player.prevOpponents,
                teamDist: player.teamPref,
                participating: true
            })
        })
        return out
    }

    private _displayStandings(lobbySettings: TLobby, participants: TTournamentParticipant[]) {
        const tournStandings = TournamentService.getCurrentStandings(participants)
        lobbySocketService.broadcast(lobbySettings.id, "displayStandings", { standings: tournStandings })

        setTimeout(() => {
            this._displayPairings(lobbySettings)
        }, 10 * 1000)
    }

    private _displayPairings(lobbySettings: TLobby) {
        const tournMatches: {
            matches: TMatch[]
            tournPairings: Pairing[]
        } = this._buildMatches(lobbySettings); //Builds matches ONLY WITH THE PLAYERS STILL PRESENT

        lobbySocketService.broadcast(lobbySettings.id, "displayPairings", { pairings: tournMatches.tournPairings })

        setTimeout(() => {
            for (let i = 0; i < tournMatches.matches.length; i++) {
                testMatchService.startMatch(lobbySettings, tournMatches.matches[i])
            }
        }, 10000)
    }

    private _buildMatches(lobbySettings: TLobby): {
        matches: TMatch[],
        tournPairings: Pairing[]
    } {
        const users = lobbySettings.users
        const matches: TMatch[] = [];

        const participants: TTournamentParticipant[] = this._getTournPlayers(users);
        const pairings = TournamentService.getNextRoundPairings(participants);
        pairings.forEach(pair => {
            const player1 = users.find(user => user.id === pair[0]);
            const player2 = users.find(user => user.id === pair[1]);
            if (!player1 || !player2) { throw Error("GAVE GIGANTIC SHIT"); }
            matches.push([player1, player2]);
        })
        return {
            matches: matches,
            tournPairings: pairings
        };
    }

    _runMatch(lobbySettings: TLobby, match: TMatch, board: number | null = null) { //TODO change to board
        const matchPlayers: TMatchPlayer[] = this._getMatchPlayers(match, lobbySettings.type);
        const userCustoms: TUserCustoms = this._buildUserCustoms(lobbySettings, matchPlayers);
        const gameSettings: TGameConfigs = this._applyDevCustoms(userCustoms);
        const serverSettings: SGameConfigs = this._buildSGameConfigs(gameSettings);

        const playerIDs: number[] = []
        matchPlayers.forEach(player => {
            if (!playerIDs.includes(player.userID)) {
                playerIDs.push(player.userID)
            }
        })

        const clientSettings: CAppConfigs = this._buildCAppConfigs(gameSettings);
        if (lobbySettings.type !== "tournament") {
            lobbySocketService.broadcast(lobbySettings.id, "startMatch", { configs: clientSettings })
        } else {
            playerIDs.forEach(id => {
                lobbySocketService.sendToUser(id, "startMatch", { configs: clientSettings })
            })
        }
        

        const game = new ServerGame(serverSettings);
        this._currentMatches.push({
            id: this._currentMatchID,
            game: game,
            playerIDs: playerIDs
        })

        //Broadcast that was previously in game but got moved out to match lobbySocket conditions for send()
        const loop = new LoopController(60);
        loop.start(() => {
            //console.log("is this even running")
            const dto = game.getGameDTO()
            //option 1
            playerIDs.forEach(id => {
                lobbySocketService.sendToUser(id, "updateGame", dto)
            })

            //Option 2
            //lobbySocketService.broadcast(lobbySettings.id, "updateGame", dto)
            
            if (game.matchResult !== null) {
                loop.pause();
                console.log(`The result of the match with id ${this._currentMatchID} was: `, game.matchResult)
                if (board) {
                    lobbySocketService.broadcast(lobbySettings.id, "updateTournamentResult", { board: board, result: game.matchResult[SIDES.LEFT]})
                }
            }
        })
        game.startGameLoop();

        this._currentMatchID++
    }

    _getMatchPlayers(users: TLobbyUser[], lobbyType: TLobbyType): TMatchPlayer[] {
        const out: TMatchPlayer[] = []
        if (lobbyType === "friendly") {
            users.forEach(user => {
                if (user.player) {
                    const players = user.player as TFriendlyPlayer[]
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
        } else if (lobbyType === "ranked") {
            users.forEach(user => {
                if (user.player) {
                    const player = user.player as TRankedPlayer;
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
        } else {
            for (let i = 0; i < users.length; i++) {
                out.push({
                    userID: users[i].id,
                    id: users[i].id,
                    nickname: users[i].username,
                    spriteID: users[i].spriteID,
                    team: i === 0 ? SIDES.LEFT : SIDES.RIGHT, //Change to taking team preference into account
                    role: ROLES.BACK,
                })
            }
        }
        return out;
    }
}

export const testMatchService = new TestMatchService()