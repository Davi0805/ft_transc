
import SPaddle from "../Objects/SPaddle"
import SPlayer from "./SPlayer.js";

// Represents a human player
export default class SHuman extends SPlayer {
    constructor(id: number, paddle: SPaddle) {
        super(paddle);
        this._id = id;
    }

    private _id: number;
    get id(): number { return this._id; }
}