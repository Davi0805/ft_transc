import { TGameConfigs, CAppConfigs, SGameConfigs, TControls } from "./types.js";
import Point from "./Point.js";
import { BALL_TYPES } from "../server/Objects/SBall.js";

export function buildCAppConfigs(gameGonfigs: TGameConfigs, 
  clientID: number, websocket: WebSocket): CAppConfigs {
    const humansInClient = gameGonfigs.clients.find(client => client.id == clientID)?.humans;
    if (humansInClient === undefined) {
      throw new Error(`The clientID ${clientID} has no controls saved in gameConfigs!`)
    }
    const controlsMap = new Map<number, TControls>;
    humansInClient.forEach(human => {
      controlsMap.set(human.id, human.controls);
    })
    
    const out: CAppConfigs = {
      websocket: websocket,
      appConfigs: {
        width: gameGonfigs.field.size.x,
        height: gameGonfigs.field.size.y
      },
      gameSceneConfigs: {
        controls: controlsMap,
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
        score: {
          score: team.score.score,
          pos: team.score.pos
        },
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
        type: BALL_TYPES.BASIC,
        pos: Point.fromObj(gameConfigs.ball.pos),
        size: Point.fromObj(gameConfigs.ball.size),
        speed: gameConfigs.ball.speed,
        direction: Point.fromObj(gameConfigs.ball.direction)
      },
      paddles: []
    }
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
    out.gameInitialState.paddles.push({
      id: paddle.id,
      size: paddle.size,
      pos: Point.fromObj(paddle.pos),
      side: paddle.side,
      speed: paddle.speed
    })
  })

  return out;
}