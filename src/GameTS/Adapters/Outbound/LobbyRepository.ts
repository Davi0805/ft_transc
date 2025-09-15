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
        //TODO: Currently working because there is a try-catch in the top level, but probably should not. Doublecheck what is the best way
        //It is genuinely possible for the lobby to not exist, for example, when one it is closed but the /play page in another client is not updated
        if (!lobby) { throw Error(`Lobby with lobbyID ${lobbyID} not found!`)} 
        return lobby
    }

    remove(lobbyID: number) {
        this._lobbies = this._lobbies.filter(lobby => lobby.id !== lobbyID);
    }

    private _lobbies: LobbyT[] = [];
}

const lobbyRepository = new LobbyRepository();
export default lobbyRepository;