import { CAppConfigs, SGameConfigs, SIDES } from "../misc/types";
import { Point } from "@pixi/math";
import '@pixi/math-extras'

import { DevCustoms, UserCustoms } from "../misc/gameOptions";

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
          size: devCustoms.ball.size,
          pos: new Point(devCustoms.ball.pos.x, devCustoms.ball.pos.y),
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
      size: new Point(paddleConfigs.size.x, paddleConfigs.size.y),
      pos: new Point(paddleConfigs.pos.x, paddleConfigs.pos.y),
      spriteID: chooseSprite(paddleConfigs.side, userCustoms.clients)
    })
  }
  return appConfigs;
}

export function buildSGameConfigs(devCustoms: typeof DevCustoms,
        userCustoms: typeof UserCustoms): SGameConfigs {
  const gameConfigs: SGameConfigs = {
    window: {
      size: new Point(devCustoms.window.size.x, devCustoms.window.size.y)
    },
    players: [],
    gameInitialState: {
      ball: {
        pos: new Point(devCustoms.ball.pos.x, devCustoms.ball.pos.y),
        size: devCustoms.ball.size,
        speed: devCustoms.ball.speed,
        direction: new Point(devCustoms.ball.direction.x, devCustoms.ball.direction.y)
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
      size: new Point(paddleConfigs.size.x, paddleConfigs.size.y),
      pos: new Point(paddleConfigs.pos.x, paddleConfigs.pos.y),
      speed: paddleConfigs.speed
    })
  }
  return gameConfigs;
}
