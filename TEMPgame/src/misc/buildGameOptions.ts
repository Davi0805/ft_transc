import { TGameConfigs, CAppConfigs, SGameConfigs, SIDES } from "./types.js";
import Point from "./Point.js";
import { applyDevCustoms, UserCustoms } from "./gameOptions";
import { getRandomInt } from "./utils.js";

/* function chooseSprite(side: SIDES, humans: {side: SIDES, paddleSprite: number}[]): number {
    for (const human of humans) {
        if (human.side === side) {
            return (human.paddleSprite);
        }
    }
    return Math.floor(Math.random()); //TODO: Multiply by the amount of existent sprites
}

export function buildCAppConfigs(devCustoms: typeof DevCustoms,
        userCustoms: typeof UserCustoms, clientID: number, websocket: WebSocket): CAppConfigs {
  const appConfigs: CAppConfigs = {
    websocket: websocket,
    appConfigs: {
      width: devCustoms.window.size.x, //TODO: Doublecheck this. This might need to take the size of the parent element instead
      height: devCustoms.window.size.y
    },
    gameSceneConfigs: {
      controls: userCustoms.humans[clientID].controls, // This should be matched with clientID in humans, not by position
      gameInitialState: {
        ball: {
          size: Point.fromObj(devCustoms.ball.size),
          pos: Point.fromObj(devCustoms.ball.pos),
          spriteID: userCustoms.ball.spriteID
        },
        players: []
      }
    }
  }

  const sidesAvailable = new Set(Object.values(SIDES).filter(
    v => typeof v === "number"
  ) as SIDES[]);
  for (let i = 0; i < userCustoms.playersAmount; i++) {
    let playerConfigs: Pick<typeof userCustoms.humans[number],
      "side" | "paddleSprite"> | undefined = userCustoms.humans[i];
    if (playerConfigs == undefined) {
      playerConfigs = {
        side: sidesAvailable[getRandomInt(0, sidesAvailable.length)],
        paddleSprite: getRandomInt(0, 2) //TODO is there any way I can know from here how many paddle sprites there are??
      }
    }
    sidesAvailable.
    const paddleConfigs = devCustoms.paddles.find(paddle => paddle.side === playerConfigs.side)
    if (paddleConfigs === undefined) {
      throw new Error("Somehow playerConfigs has a side that is not present in devConfigs??")
    }
    appConfigs.gameSceneConfigs.gameInitialState.players.push({
      side: playerConfigs.side,
      paddle: {
        side: paddleConfigs.side,
        size: Point.fromObj(paddleConfigs.size),
        pos: Point.fromObj(paddleConfigs.pos),
        spriteID: chooseSprite(paddleConfigs.side, userCustoms.humans)
      },
      score: devCustoms.startingScore
    })
  }
  return appConfigs;
}

export function buildSGameConfigs(devCustoms: typeof DevCustoms,
        userCustoms: typeof UserCustoms): SGameConfigs {
  const gameConfigs: SGameConfigs = {
    window: {
      size: Point.fromObj(devCustoms.window.size)
    },
    players: [],
    gameInitialState: {
      ball: {
        pos: Point.fromObj(devCustoms.ball.pos),
        size: Point.fromObj(devCustoms.ball.size),
        speed: devCustoms.ball.speed,
        direction: Point.fromObj(devCustoms.ball.direction)
      },
      paddles: []
    }
  }
  for (const human of userCustoms.humans) {
    gameConfigs.players.push({
      keyboardState: {
        left: { pressed: false },
        right: { pressed: false },
        pause: { pressed: false }
      },
      paddleSide: human.side
    })
  }
  for (let i = 0; i < userCustoms.playersAmount; i++) {
    const paddleConfigs = devCustoms.paddles[i];
    gameConfigs.gameInitialState.paddles.push({
      side: paddleConfigs.side,
      size: Point.fromObj(paddleConfigs.size),
      pos: Point.fromObj(paddleConfigs.pos),
      speed: paddleConfigs.speed
    })
  }
  return gameConfigs;
} */

export function buildCAppConfigs(gameGonfigs: TGameConfigs, 
  clientID: number, websocket: WebSocket): CAppConfigs {

    const playerControls = gameGonfigs.humans.find(obj => obj.clientID === clientID)?.controls
    if (playerControls === undefined) {
      throw new Error(`The clientID ${clientID} has no controls saved in gameConfigs!`)
    }

    const out: CAppConfigs = {
      websocket: websocket,
      appConfigs: {
        width: gameGonfigs.field.size.x,
        height: gameGonfigs.field.size.y
      },
      gameSceneConfigs: {
        controls: playerControls,
        gameInitialState: {
          ball: {
            size: Point.fromObj(gameGonfigs.ball.size),
            pos: Point.fromObj(gameGonfigs.ball.pos),
            spriteID: gameGonfigs.ball.spriteID
          },
          teams: [],
          paddles: []
        }
      }
    }

    for (let team of gameGonfigs.teams) {
      out.gameSceneConfigs.gameInitialState.teams.push({
        side: team.side,
        score: team.score
      })
    }
    for (let paddle of gameGonfigs.paddles) {
      out.gameSceneConfigs.gameInitialState.paddles.push({
        side: paddle.side,
        size: Point.fromObj(paddle.size),
        pos: Point.fromObj(paddle.pos),
        spriteID: paddle.spriteID
      })
    }

    return out;
}

export function buildSGameConfigs(gameConfigs: TGameConfigs): SGameConfigs {
  const out: SGameConfigs = {
    window: {
      size: Point.fromObj(gameConfigs.field.size)
    },
    humans: [],
    bots: [],
    gameInitialState: {
      ball: {
        pos: Point.fromObj(gameConfigs.ball.pos),
        size: Point.fromObj(gameConfigs.ball.size),
        speed: gameConfigs.ball.speed,
        direction: Point.fromObj(gameConfigs.ball.direction)
      },
      paddles: []
    }
  }
  for (let human of gameConfigs.humans) {
    out.humans.push({
      clientID: human.clientID,
      paddleID: human.paddleID,
      keyboardState: {
        left: { pressed: false },
        right: { pressed: false },
        pause: { pressed: false }
      },
    })
  }
  for (let paddle of gameConfigs.paddles) {
    out.gameInitialState.paddles.push({
      id: paddle.id,
      size: paddle.size,
      pos: Point.fromObj(paddle.pos),
      side: paddle.side,
      speed: paddle.speed
    })
  }
  return out;
}