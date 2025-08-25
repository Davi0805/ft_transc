import ServerGame, { SGameConfigs } from "../game/ServerGame.js";
import { CAppConfigs, TGameConfigs, TUserCustoms } from "../game/shared/SetupDependencies.js";
import { point, ROLES, SIDES } from "../game/shared/sharedTypes.js";
import { MatchDurationT, MatchMapT, MatchPlayerT, MatchSettingsT } from "../Repositories/MatchRepository.js";

class MatchFactory {
    generateMatchInfo(settings: MatchSettingsT, players: MatchPlayerT[]) {
        const userCustoms: TUserCustoms = this._buildUserCustoms(settings, players);
        const gameSettings: TGameConfigs = this._applyDevCustoms(userCustoms);
        const serverConfigs: SGameConfigs = this._buildSGameConfigs(gameSettings);
        const clientConfigs: CAppConfigs = this._buildCAppConfigs(gameSettings);

        const userIDs: number[] = []
        players.forEach(player => {
            if (!userIDs.includes(player.userID)) {
                userIDs.push(player.userID)
            }
        })

        return {
            clientConfigs: clientConfigs,
            serverConfigs: serverConfigs,
            userIDs: userIDs
        };
    }

    create(matchConfigs: SGameConfigs) {
        const game = new ServerGame(matchConfigs);
        return game
    }

    private _buildUserCustoms(settings: MatchSettingsT, players: MatchPlayerT[]): TUserCustoms {
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
        let availableSlots = getSlotsFromMap(settings.map)
        players.forEach(player => {
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

    private _applyDevCustoms(userCustoms: TUserCustoms): TGameConfigs {
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

    private _buildSGameConfigs(gameConfigs: TGameConfigs): SGameConfigs {
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

    private _buildCAppConfigs(gameConfigs: TGameConfigs): CAppConfigs {        
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

    private _getSizeFromMap(map: MatchMapT) {
        const [_amountStr, _type, size] = map.split("-");
        switch (size) {
            case "small": return { x: 500, y: 500 }
            case "medium": return { x: 700, y: 700 }
            case "big": return { x: 900, y: 900 }
            default: throw Error("Size not detected!");
        }
    }

    private _getSecondsFromDuration(duration: MatchDurationT) {
        const durationToSeconds: Record<MatchDurationT, number> = {
            "blitz": 60,
            "rapid": 90,
            "classical": 120,
            "long": 150,
            "marathon": 180
        }
        return durationToSeconds[duration]
    }

    private _getStartingScoreFromDuration(duration: MatchDurationT) {
        const durationToScore: Record<MatchDurationT, number> = {
            "blitz": 100,
            "rapid": 150,
            "classical": 200,
            "long": 250,
            "marathon": 300
        }
        return durationToScore[duration]
    }
}

export const matchFactory = new MatchFactory()

export function getSlotsFromMap(map: MatchMapT): { team: SIDES, role: ROLES }[] {
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