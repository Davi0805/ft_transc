export default class LoopController {
    constructor(tickerRate) {
        this._tickerRate = tickerRate;
        this._isRunning = true;
        this._prevTime = Date.now();
        this._currentTime = this._prevTime;
        this._tickerTimer = 0;
        this._delta = 0;
    }
    start(fn) {
        const loop = () => {
            this._updateVars();
            fn();
            setTimeout(loop, 1000 / this._tickerRate);
        };
        loop();
    }
    pause() { this._isRunning = false; }
    unpause() { this._isRunning = true; }
    togglePause() { this._isRunning = !this._isRunning; }
    // Update rate in seconds
    isEventTime(updateRate) {
        return (this._tickerTimer % (this._tickerRate * updateRate) === 0);
    }
    _updateVars() {
        this._prevTime = this._currentTime;
        this._currentTime = Date.now();
        this._delta = (this._currentTime - this._prevTime) / 1000;
        if (this._isRunning) {
            this._tickerTimer++;
        }
    }
    _tickerRate; //in ticks per Second
    _isRunning;
    get isRunning() { return this._isRunning; }
    _prevTime;
    _currentTime;
    _tickerTimer;
    _delta;
    get delta() { return this._delta; }
}
