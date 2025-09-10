import { LobbyT } from "../../Application/Factories/LobbyFactory.js";

class LobbyRepository {
    add(lobby: LobbyT) {
        this._lobbies.push(lobby);
    }

    getAll() {
        return this._lobbies
    }

    getByID(lobbyID: number) {
        const lobby = this._lobbies.find(lobby => lobby.id === lobbyID)
        if (!lobby) { throw Error(`Lobby with lobbyID ${lobbyID} not found!`)} //TODO: Should it be so strict?
        return lobby
    }

    private _lobbies: LobbyT[] = [];
}

const lobbyRepository = new LobbyRepository();
export default lobbyRepository;