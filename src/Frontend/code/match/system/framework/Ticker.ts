type LogicCallback = (delta: number, counter: number) => void;

export default class Ticker {
    constructor() {
        this._isRunning = true;
        this._tickerTimer = 0;
        this._delta = 0;
    }

    start() {
        this._stop = false;
        let prevTime = performance.now();
        const loop = () => {
            const now = performance.now();
            this._delta = (now - prevTime) / 1000; //SECONDS between each frame
            prevTime = now;
            if (this._isRunning) {this._callCallbacks();}
            this._tickerTimer += 1;
            if (!this._stop) {
                requestAnimationFrame(loop); //Updates with the refresh rate of the browser (60Hz)
            }
        }
        loop();
    }
    stop() {
        console.log("stop was set")
        this._stop = true;
    }

    pause() { this._isRunning = false; }
    unpause() { this._isRunning = true; }
    togglePause() { this._isRunning = !this._isRunning; }

    add(callback: LogicCallback) {
        this._callbacks.push(callback);
    }
    
    remove(callback: LogicCallback) {
        for (let i = this._callbacks.length; i >= 0; i--) {
            if (this._callbacks[i] === callback) {
                this._callbacks.splice(i, 1);
                return;
            }
        }
    }

    // Update rate in seconds
    isEventTime(updateRate: number): boolean {
        return (this._tickerTimer % (60 * updateRate) === 0);
    }

    protected _callCallbacks() {
        this._callbacks.forEach(callback => {
            callback(this._delta, this._tickerTimer);
        })
    }

    private _isRunning: boolean;
    get isRunning(): boolean { return this._isRunning; }

    private _stop: boolean = false;
    private _tickerTimer: number;
    private _delta: number;
    get delta(): number { return this._delta }

    private _callbacks: LogicCallback[] = [];
}