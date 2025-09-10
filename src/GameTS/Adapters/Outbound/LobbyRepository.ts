import { LobbyT } from "../../Application/Factories/LobbyFactory.js";

class LobbyRepository {
    add(lobby: LobbyT) {
        this._lobbies.push(lobby);
    }

    getAll() {
        return this._lobbies
    }

    private _lobbies: LobbyT[] = [];
}

const lobbyRepository = new LobbyRepository();
export default lobbyRepository;