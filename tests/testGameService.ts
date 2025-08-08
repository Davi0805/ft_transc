import { TDuration, TLobby, TLobbyUser, TMap, TMatchPlayer, TTournamentParticipant, TTournamentPlayer } from "./dependencies/lobbyTyping.js";
import { lobbySocketService } from "./testLobbySocketService.js";
import { SGameConfigs } from "./testMatchService.js";
import LoopController from "./game/LoopController.js";
import ServerGame from "./game/ServerGame.js";
import { CAppConfigs, TGameConfigs, TUserCustoms } from "./game/shared/SetupDependencies.js";
import { point, ROLES, SIDES } from "./game/shared/sharedTypes.js";
import { CGameDTO } from "./dependencies/dtos.js";

export type TMatchInRepo = {
    id: number,
    clientSettings: CAppConfigs,
    serverGame: ServerGame,
    userIDs: number[]
}

class TestGameService {

    loadMatch(lobbySettings: TLobby, players: TMatchPlayer[]) {
        const userCustoms: TUserCustoms = this._buildUserCustoms(lobbySettings, players);
        const gameSettings: TGameConfigs = this._applyDevCustoms(userCustoms);
        const serverSettings: SGameConfigs = this._buildSGameConfigs(gameSettings);
        const clientSettings: CAppConfigs = this._buildCAppConfigs(gameSettings);

        const userIDs: number[] = []
        players.forEach(player => {
            if (!userIDs.includes(player.userID)) {
                userIDs.push(player.userID)
            }
        })

        const game = new ServerGame(serverSettings);
        this._matches.set(this._currentMatchID, {
            id: this._currentMatchID,
            clientSettings: clientSettings,
            serverGame: game,
            userIDs: userIDs
        })

        return this._matches.get(this._currentMatchID++)



        //TODO: This probably has to be moved to the services
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
    }

    

    updateControlsState(playerID: number, controlsDTO: CGameDTO) {
        const match = this._matches.find(match => match.userIDs.includes(playerID))
        if (!match) {throw Error("This playerID is not present in any match!!")}
        match.serverGame.processClientDTO(controlsDTO)
    }



    private _currentMatchID: number = 0;
    private _matches: TMatchInRepo[] = []


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

    /*  */

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

export const testGameService = new TestGameService()