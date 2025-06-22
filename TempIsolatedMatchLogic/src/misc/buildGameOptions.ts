import { TGameConfigs, CAppConfigs, SGameConfigs, TControls } from "./types.js";

export function buildCAppConfigs(gameConfigs: TGameConfigs, 
  clientID: number, websocket: WebSocket): CAppConfigs {
    const humansInClient = gameConfigs.clients.find(client => client.id == clientID)?.humans;
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