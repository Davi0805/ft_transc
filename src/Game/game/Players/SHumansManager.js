import SHuman from "./SHuman.js";
export default class SHumansManager {
    constructor(humansConfigs, paddles) {
        humansConfigs.forEach(human => {
            const humanPaddle = paddles.find(paddle => paddle.id === human.paddleID);
            if (!humanPaddle) {
                throw new Error(`A human says it owns a paddle with paddleID ${human.paddleID}, but that paddleID does not exist!`);
            }
            this._humans.push(new SHuman(human.id, humanPaddle));
        });
    }
    update() {
        this.humans.forEach(human => {
            human.SetPaddleMovement();
        });
    }
    updateControlState(humanID, controlsState) {
        const human = this.humans.find((human => human.id === humanID));
        if (human === undefined) {
            throw new Error(`Server cannot find a human with id ${humanID}, which was requesteb by a client!`);
        }
        human.controls = controlsState;
    }
    _humans = [];
    get humans() { return this._humans; }
}
