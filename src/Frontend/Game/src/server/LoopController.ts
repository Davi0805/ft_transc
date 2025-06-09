export default class LoopController {
    constructor(tickerRate: number) {
        this._tickerRate = tickerRate
        this._isRunning = false;
        this._prevTime = Date.now();
        this._currentTime = this._prevTime;
        this._tickerTimer = 0;
        this._delta = 0;
    }

    start(fn: () => void) {
        const loop = () => {
            this._updateVars();
            fn();
            setTimeout(loop, 1000 / this._tickerRate);
        }
        loop();
    }

    pause() { this._isRunning = false; }
    unpause() { this._isRunning = true; }
    togglePause() { this._isRunning = !this._isRunning; }

    isEventTime(updateRate: number): boolean {
        return (this._tickerTimer % (this._tickerRate * updateRate) === 0);
    }

    private _updateVars() {
        this._prevTime = this._currentTime;
        this._currentTime = Date.now();
        this._delta = (this._currentTime - this._prevTime) / 1000;
        if (this._isRunning) { this._tickerTimer++; }
    }

    private _tickerRate: number; //in ticks per Second
    private _isRunning: boolean;
    get isRunning(): boolean { return this._isRunning; }
    private _prevTime: number;
    private _currentTime: number;
    private _tickerTimer: number;
    private _delta: number;
    get delta(): number { return this._delta }
}