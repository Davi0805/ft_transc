import { AppConfigs } from "./scripts/system/framework/Application"
import { point, SIDES, TPaddle } from "../shared/sharedTypes"
import { TControls, TGameConfigs } from "../shared/SetupDependencies"

export type CGameState = {
    teams: {
        side: SIDES,
        score: {
            score: number,
            pos: point
        }
    }[]
    paddles: Pick<TPaddle, "id" | "side" | "size" | "speed" | "pos" | "spriteID">[],
    gameLength: number
}

export type CGameSceneConfigs = {
    fieldSize: point
    controls: Map<number, TControls>
    gameInitialState: CGameState
}


export type CAppConfigs = {
    websocket: WebSocket,
    appConfigs: AppConfigs,
    gameSceneConfigs: CGameSceneConfigs
}

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