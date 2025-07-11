import { TGameConfigs } from "../shared/SetupDependencies"
import { SIDES, TWindow, TPaddle, } from "../shared/sharedTypes"

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