import SPlayer from "./SPlayer.js";
// Represents a human player
export default class SHuman extends SPlayer {
    constructor(id, paddle) {
        super(paddle);
        this._id = id;
    }
    _id;
    get id() { return this._id; }
}
