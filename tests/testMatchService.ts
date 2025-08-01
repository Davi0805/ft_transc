import { WebSocket } from "ws";
import { CGameDTO } from "./dependencies/dtos.js";
import { TDuration, TMap, TLobby, TLobbyType, TFriendlyPlayer, TRankedPlayer, TTournamentPlayer, TTournPlayer, TMatchPlayer, TLobbyUser, OutboundDTO} from "./dependencies/lobbyTyping.js"
import ServerGame from "./game/ServerGame.js";
import { TUserCustoms, TGameConfigs, TControls, CAppConfigs } from "./game/shared/SetupDependencies.js"
import { point, SIDES, ROLES, TWindow, TPaddle } from "./game/shared/sharedTypes.js"
import { lobbySocketService } from "./testLobbySocketService.js";
import { Pairing, TournamentService } from "./TournamentService.cjs";
import LoopController from "./game/LoopController.js";

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

    startMatch(lobbySettings: TLobby) {
        
        if (lobbySettings.type !== "tournament") {
            this._runMatch(lobbySettings, lobbySettings.users)
        } else {
            const tournMatches: {
                matches: TMatch[]
                tournPairings: Pairing[]
            } = this._buildMatches(lobbySettings);

            lobbySocketService.broadcast(lobbySettings.id, "displayPairings", { pairings: tournMatches.tournPairings })

            setTimeout(() => {
                tournMatches.matches.forEach(match => {
                    this._runMatch(lobbySettings, match, tournMatches.tournPairings)
                })
            }, 10000)
        }
    }

    updateControlsState(playerID: number, controlsDTO: CGameDTO) {
        const match = this._currentMatches.find(match => match.playerIDs.includes(playerID))
        if (!match) {throw Error("This playerID is not present in any match!!")}
        match.game.processClientDTO(controlsDTO)
    }

    private _currentMatchID: number = 0;
    private _currentMatches: {
        id: number
        game: ServerGame,
        playerIDs: number[] 
    }[] = []



    _buildMatches(lobbySettings: TLobby): {
        matches: TMatch[],
        tournPairings: Pairing[]
    } {
        const users = lobbySettings.users
        const matches: TMatch[] = [];

        const participants: TTournPlayer[] = this._getTournPlayers(users);
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

    _runMatch(lobbySettings: TLobby, match: TMatch, tournPairings: Pairing[] | null = null) {
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
            id: this._currentMatchID++,
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
        })
        game.startGameLoop();
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

    _buildUserCustoms(settings: TLobby, players: TMatchPlayer[]): TUserCustoms {
        const userCustoms: TUserCustoms = {
            field: {
                size: this._getSizeFromMap(settings.map),
                backgroundSpriteID: 0 //TODO: Generate randomly
            },
            matchLength: this._getSecondsFromDuration(settings.duration),
            startingScore: this._getStartingScoreFromDuration(settings.duration),
            paddles: [],
            clients: [],
            bots: []
        }

        let paddleID = 0;
        let availableSlots = this._getSlotsFromMap(settings.map)
        players.forEach(player => {
            if (player.userID === null || player.id === null || player.spriteID === null) {
                throw Error("This player is not initialized!!");
            }

            userCustoms.paddles.push({
                id: paddleID,
                side: player.team,
                role: player.role,
                spriteID: player.spriteID
            })

            const human = {
                id: player.id,
                paddleID: paddleID,
            }
            const client = userCustoms.clients.find(client => client.id === player.userID);
            if (client) {
                client.humans.push(human);
            } else {
                userCustoms.clients.push({
                    id: player.userID,
                    humans: [human]
                })
            }
            paddleID++

            availableSlots = availableSlots.filter(slot => slot.team !== player.team || slot.role !== player.role)
        })

        console.log(availableSlots)
        availableSlots.forEach(slot => {
            userCustoms.paddles.push({
                id: paddleID,
                side: slot.team,
                role: slot.role,
                spriteID: 0 //Maybe should be random? Or a specific bot one?
            })
            userCustoms.bots.push({
                paddleID: paddleID,
                difficulty: 1
            })
        })

        return userCustoms
    }

    _applyDevCustoms(userCustoms: TUserCustoms): TGameConfigs {
        const out: TGameConfigs = {
            field: userCustoms.field,
            matchLength: userCustoms.matchLength,
            teams: [],
            paddles: [],
            clients: userCustoms.clients,
            bots: userCustoms.bots,
            startingScore: 0
        }

        // Apply dev customs for each individual paddle and team
        userCustoms.paddles.forEach(paddle => {
            let scorePos: point;
            let paddlePos: point;
            const scoreOffset = 140
            const paddleOffset = (paddle.role === ROLES.BACK ? 40 : 80);
            switch (paddle.side) {
                case (SIDES.LEFT): {
                    scorePos = { x: scoreOffset, y: userCustoms.field.size.y / 2}
                    paddlePos = { x: paddleOffset, y: userCustoms.field.size.y / 2 };
                    break;
                }
                case (SIDES.RIGHT): {
                    scorePos = { x: userCustoms.field.size.x - scoreOffset, y: userCustoms.field.size.y / 2 }
                    paddlePos = { x: userCustoms.field.size.x - paddleOffset, y: userCustoms.field.size.y / 2 }
                    break; 
                }
                case (SIDES.TOP): {
                    scorePos = { x: userCustoms.field.size.x / 2, y: scoreOffset };
                    paddlePos = { x: userCustoms.field.size.x / 2, y: paddleOffset };
                    break;
                }
                case (SIDES.BOTTOM): {
                    scorePos = { x: userCustoms.field.size.x / 2, y: userCustoms.field.size.y - scoreOffset}
                    paddlePos = { x: userCustoms.field.size.x / 2, y: userCustoms.field.size.y - paddleOffset}
                }
            }

            if (out.teams.find(team => team.side === paddle.side) === undefined) {
                out.teams.push({
                    side: paddle.side,
                    score: {
                        score: 100,
                        pos: scorePos
                    }
                })
            }
            out.paddles.push({
                id: paddle.id,
                side: paddle.side,
                role: paddle.role,
                spriteID: paddle.spriteID,
                pos: paddlePos,
                size: { x: 32, y: 128 },
                speed: 400
            })
        })

        return out;
    }

    _buildSGameConfigs(gameConfigs: TGameConfigs): SGameConfigs {
        const out: SGameConfigs = {
            window: {
            size: gameConfigs.field.size
            },
            matchLength: gameConfigs.matchLength,
            teams: [],
            humans: [],
            bots: [],
            paddles: []
        }
        gameConfigs.teams.forEach(team => {
            out.teams.push({
            side: team.side,
            score: team.score.score
            })
        })
        gameConfigs.clients.forEach(client => {
            client.humans.forEach(human => {
                out.humans.push(human)
            })
        })
        out.bots = gameConfigs.bots
        gameConfigs.paddles.forEach(paddle => {
            out.paddles.push({
            id: paddle.id,
            size: paddle.size,
            pos: paddle.pos,
            side: paddle.side,
            speed: paddle.speed
            })
        })

        return out;
    }

    _buildCAppConfigs(gameConfigs: TGameConfigs): CAppConfigs {        
        const out: CAppConfigs = {
            appConfigs: {
                width: gameConfigs.field.size.x,
                height: gameConfigs.field.size.y
            },
            gameSceneConfigs: {
                fieldSize: gameConfigs.field.size,
                controls: null,
                gameInitialState: {
                teams: [],
                paddles: [],
                gameLength: gameConfigs.matchLength
                }
            }
        }

        for (let team of gameConfigs.teams) {
            out.gameSceneConfigs.gameInitialState.teams.push({
                side: team.side,
                score: {
                score: team.score.score,
                pos: team.score.pos
                },
            })
        }

        for (let paddle of gameConfigs.paddles) {
            out.gameSceneConfigs.gameInitialState.paddles.push({
                id: paddle.id,
                side: paddle.side,
                size: paddle.size,
                speed: paddle.speed,
                pos: paddle.pos,
                spriteID: paddle.spriteID
            })
        }

        return out;
    }

    _getTournPlayers(users: TLobbyUser[]): TTournPlayer[] {
        const out: TTournPlayer[] = [];
        users.forEach(user => {
            const player = user.player as TTournamentPlayer;
            if (player.participating) {
                out.push({
                    id: user.id,
                    nick: user.username,
                    score: player.score,
                    rating: user.rating,
                    prevOpponents: player.prevOpponents,
                    teamDist: player.teamPref,
                    participating: player.participating,
                    ready: user.ready
                })
            }
        })
        return out
    }

    _getSecondsFromDuration(duration: TDuration) {
        const durationToSeconds: Record<TDuration, number> = {
            "blitz": 60,
            "rapid": 90,
            "classical": 120,
            "long": 150,
            "marathon": 180
        }
        return durationToSeconds[duration]
    }

    _getStartingScoreFromDuration(duration: TDuration) {
        const durationToScore: Record<TDuration, number> = {
            "blitz": 100,
            "rapid": 150,
            "classical": 200,
            "long": 250,
            "marathon": 300
        }
        return durationToScore[duration]
    }

    _getSizeFromMap(map: TMap) {
        const [_amountStr, _type, size] = map.split("-");
        switch (size) {
            case "small": return { x: 500, y: 500 }
            case "medium": return { x: 700, y: 700 }
            case "big": return { x: 900, y: 900 }
            default: throw Error("Size not detected!");
        }
    }

    _getSlotsFromMap(map: TMap): { team: SIDES, role: ROLES }[] {
        const out: { team: SIDES, role: ROLES }[] = []
        const [amountStr, type, _size] = map.split("-");
        out.push({ team: SIDES.LEFT, role: ROLES.BACK })
        out.push({ team: SIDES.RIGHT, role: ROLES.BACK })
        if (type === "teams") {
            out.push({ team: SIDES.LEFT, role: ROLES.FRONT })
            out.push({ team: SIDES.RIGHT, role: ROLES.FRONT })
        }

        if (amountStr === "4") {
            out.push({ team: SIDES.TOP, role: ROLES.BACK })
            out.push({ team: SIDES.BOTTOM, role: ROLES.BACK })
            if (type === "teams") {
                out.push({ team: SIDES.TOP, role: ROLES.FRONT })
                out.push({ team: SIDES.BOTTOM, role: ROLES.FRONT })
            }
        } 
        return out
    }
}

export const testMatchService = new TestMatchService()