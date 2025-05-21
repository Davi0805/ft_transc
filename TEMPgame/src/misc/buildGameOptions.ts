import { CAppConfigs, SGameConfigs, SIDES } from "./types";
import Point from "./Point.js";
import { DevCustoms, UserCustoms } from "./gameOptions";

function chooseSprite(side: SIDES, clients: {side: number, paddleSprite: number}[]): number {
    for (const client of clients) {
        if (client.side === side) {
            return (client.paddleSprite);
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
      controls: userCustoms.clients[clientID].controls,
      gameInitialState: {
        ball: {
          size: Point.fromObj(devCustoms.ball.size),
          pos: Point.fromObj(devCustoms.ball.pos),
          spriteID: userCustoms.ball.spriteID
        },
        paddles: []
      }
    }
  }
  for (let i = 0; i < userCustoms.paddlesAmount; i++) {
    const paddleConfigs = devCustoms.paddles[i];
    appConfigs.gameSceneConfigs.gameInitialState.paddles.push({
      side: paddleConfigs.side,
      size: Point.fromObj(paddleConfigs.size),
      pos: Point.fromObj(paddleConfigs.pos),
      spriteID: chooseSprite(paddleConfigs.side, userCustoms.clients)
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
  for (const client of userCustoms.clients) {
    gameConfigs.players.push({
      keyboardState: {
        left: { pressed: false },
        right: { pressed: false },
        pause: { pressed: false }
      },
      paddleSide: client.side
    })
  }
  for (let i = 0; i < userCustoms.paddlesAmount; i++) {
    const paddleConfigs = devCustoms.paddles[i];
    gameConfigs.gameInitialState.paddles.push({
      side: paddleConfigs.side,
      size: Point.fromObj(paddleConfigs.size),
      pos: Point.fromObj(paddleConfigs.pos),
      speed: paddleConfigs.speed
    })
  }
  return gameConfigs;
}
