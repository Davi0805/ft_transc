import { point, rectangle, SIDES } from "../misc/types.js";
import SBot from "./SBot.js";
import SPaddle from "./SPaddle";
import SBall, { SBALL_DEFAULT_SIZE } from "./SBall.js";
import LoopController from "./LoopController";

export default class BotsManager {
    constructor(botsConfigs: { paddleID: number; difficulty: number}[],
        paddles: SPaddle[], windowSize: point
    ) {
        const windowLimits = this._buildLimits(paddles, windowSize); 
        botsConfigs.forEach(bot => {
            const botPaddle = paddles.find(paddle => paddle.id === bot.paddleID);
            if (!botPaddle) {
                throw new Error(`A bot says it owns a paddle with paddleID ${bot.paddleID}, but that paddleID does not exist!`)
            }
            this._bots.push(
                new SBot(
                    windowLimits,
                    botPaddle,
                    bot.difficulty
                )
            )
        })
    }

    update(loop: LoopController, balls: SBall[]) {
        this._bots.forEach(bot => {
            if (loop.isEventTime(bot.updateRate)) {
                bot.updateTargetPos(balls);
            }
            bot.setupMove();
            bot.movePaddleFromControls(loop.delta);
        })
    }


    private _bots: SBot[] = []

    private _buildLimits(paddles: SPaddle[], windowSize: point): rectangle {
        const sideConfig: Record<SIDES, { axis: 'x' | 'y', boundary: 'min' | 'max' }> = {
            [SIDES.LEFT]:   { axis: 'x', boundary: 'min' },
            [SIDES.RIGHT]:  { axis: 'x', boundary: 'max' },
            [SIDES.TOP]:    { axis: 'y', boundary: 'min' },
            [SIDES.BOTTOM]: { axis: 'y', boundary: 'max' },
        }

        const sides = Object.values(SIDES).filter(v => typeof v === "number") as SIDES[];
        const record: Record<SIDES, number> = {} as Record<SIDES, number>
        sides.forEach(side => {
            const { axis, boundary } = sideConfig[side];
            const posValues = paddles.filter(paddle => paddle.side === side).map(paddle => paddle.pos[axis]);
            if (posValues.length === 0) {
                record[side] = (boundary === 'min') ? 0 : windowSize[axis]
            } else {
                const halfPaddlethickness = paddles[0].size.x / 2;
                record[side] = (boundary === 'min')
                    ? Math.max(...posValues) + halfPaddlethickness
                    : Math.min(...posValues) - halfPaddlethickness
            }
        })
        const out: rectangle = {
            x: record[SIDES.LEFT] + SBALL_DEFAULT_SIZE.x / 2,
            y: record[SIDES.TOP] + SBALL_DEFAULT_SIZE.y / 2,
            width: record[SIDES.RIGHT] - record[SIDES.LEFT] - SBALL_DEFAULT_SIZE.x,
            height: record[SIDES.BOTTOM] - record[SIDES.TOP] - SBALL_DEFAULT_SIZE.y
        }
        return out
    };
}