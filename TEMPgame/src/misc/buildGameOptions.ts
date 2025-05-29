import { TGameConfigs, CAppConfigs, SGameConfigs } from "./types.js";
import Point from "./Point.js";

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
        id: paddle.id,
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
    teams: [],
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
  for (let team of gameConfigs.teams) {
    out.teams.push({
      side: team.side,
      score: team.score
    })
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