import { TDuration, TMap, TLobby, TLobbyType, TFriendlyPlayer, TRankedPlayer, TTournamentPlayer, TTournPlayer, TMatchPlayer, TLobbyUser} from "./lobbyTyping"
import { TUserCustoms, TGameConfigs, TControls, CGameSceneConfigs } from "../../match/matchSharedDependencies/SetupDependencies"
import { point, SIDES, ROLES, TWindow, TPaddle } from "../../match/matchSharedDependencies/sharedTypes"
import { TournamentService } from "../../services/TournamentService"

export type CAppConfigs = {
    appConfigs: { width: number, height: number },
    gameSceneConfigs: CGameSceneConfigs
}

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

export function getSecondsFromDuration(duration: TDuration) {
    const durationToSeconds: Record<TDuration, number> = {
        "blitz": 60,
        "rapid": 90,
        "classical": 120,
        "long": 150,
        "marathon": 180
    }
    return durationToSeconds[duration]
}

export function getStartingScoreFromDuration(duration: TDuration) {
    const durationToScore: Record<TDuration, number> = {
        "blitz": 100,
        "rapid": 150,
        "classical": 200,
        "long": 250,
        "marathon": 300
    }
    return durationToScore[duration]
}

export function getSizeFromMap(map: TMap) {
    const [_amountStr, _type, size] = map.split("-");
    switch (size) {
        case "small": return { x: 500, y: 500 }
        case "medium": return { x: 700, y: 700 }
        case "big": return { x: 900, y: 900 }
        default: throw Error("Size not detected!");
    }
}

export function buildUserCustoms(settings: TLobby, players: TMatchPlayer[]): TUserCustoms {
    const userCustoms: TUserCustoms = {
        field: {
            size: getSizeFromMap(settings.map),
            backgroundSpriteID: 0 //TODO: Generate randomly
        },
        matchLength: getSecondsFromDuration(settings.duration),
        startingScore: getStartingScoreFromDuration(settings.duration),
        paddles: [],
        clients: [],
        bots: []
    }

    const paddleID = 0;
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
            controls: {
                left: "ArrowLeft", //TODO: probably get these from lobby
                right: "ArrowRight",
                pause: " " //TODO: Deprecated. To be removed
            }
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
        
    })
    //TODO: Have to find a way to build bots into empty slots

    return userCustoms
}

export function applyDevCustoms(userCustoms: TUserCustoms): TGameConfigs {

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

function getMatchPlayers(users: TLobbyUser[], lobbyType: TLobbyType): TMatchPlayer[] {
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
                team: i === 0 ? SIDES.LEFT : SIDES.RIGHT,
                role: ROLES.BACK,
            })
        }
    }
    return out;
}
function getTournPlayers(users: TLobbyUser[]): TTournPlayer[] {
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

export function buildCAppConfigs(gameConfigs: TGameConfigs, 
  clientID: number): CAppConfigs {
    console.log(gameConfigs.clients)
    const humansInClient = gameConfigs.clients.find(client => client.id == clientID)?.humans;
    if (humansInClient === undefined) {
      throw new Error(`The clientID ${clientID} has no controls saved in gameConfigs!`)
    }
    const controlsMap = new Map<number, TControls>;
    humansInClient.forEach(human => {
      controlsMap.set(human.id, human.controls);
    })
    
    const out: CAppConfigs = {
      appConfigs: {
        width: gameConfigs.field.size.x,
        height: gameConfigs.field.size.y
      },
      gameSceneConfigs: {
        fieldSize: gameConfigs.field.size,
        controls: controlsMap,
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

export function buildSGameConfigs(gameConfigs: TGameConfigs): SGameConfigs {
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




type TMatch = TLobbyUser[];

function buildMatches(lobbySettings: TLobby, users: TLobbyUser[]): TMatch[] {
    const out: TMatch[] = [];
    if (lobbySettings.type !== "tournament") {
        out.push(users);
        return out;
    }

    const participants: TTournPlayer[] = getTournPlayers(users);
    const pairings = TournamentService.getNextRoundPairings(participants);
    pairings.forEach(pair => {
        const player1 = users.find(user => user.id === pair[0]);
        const player2 = users.find(user => user.id === pair[1]);
        if (!player1 || !player2) { throw Error("GAVE GIGANTIC SHIT"); }
        out.push([player1, player2]);
    })
    return out
}

function startMatch(lobbySettings: TLobby, users: TLobbyUser[]) {
    const matches: TMatch[] = buildMatches(lobbySettings, users);
    matches.forEach(match => {
        const matchPlayers: TMatchPlayer[] = getMatchPlayers(match, lobbySettings.type);
        const userCustoms: TUserCustoms = buildUserCustoms(lobbySettings, matchPlayers);
        const gameSettings: TGameConfigs = applyDevCustoms(userCustoms);
        const serverSettings: SGameConfigs = buildSGameConfigs(gameSettings);

        const userIDs: number[] = [] //TODO: put here user ids
        userIDs.forEach(userID => {
            const clientSettings: CAppConfigs = buildCAppConfigs(gameSettings, userID);
            //TODO: send clientSettings to each corresponding userID
        })
        //TODO: start game in backend with serverSettings
    })
}