"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lobbyRepository = void 0;
const TournamentRepository_js_1 = require("./TournamentRepository.js");
const UserRepository_js_1 = require("./UserRepository.js");
const redis = require("../Infrastructure/config/Redis.js");
class LobbyRepository {
    createLobby(configs, userID) {
        console.log(configs.matchSettings);
        const newLobby = {
            id: this._currentID,
            hostID: userID,
            name: configs.name,
            type: configs.type,
            matchSettings: configs.matchSettings,
            users: []
        };
        console.log(JSON.stringify(newLobby));
        this._lobbies.push(newLobby);
        return this._currentID++;
    }
    getLobbyByID(lobbyID) {
        const lobby = this._lobbies.find(lobby => lobby.id === lobbyID);
        if (!lobby) {
            throw Error(`Lobby with lobbyID ${lobbyID} not found!`);
        }
        return lobby;
    }
    getLobbyUserByID(lobbyID, userID) {
        const lobby = exports.lobbyRepository.getLobbyByID(lobbyID);
        const user = lobby.users.find(user => user.id === userID);
        if (!user) {
            throw Error("User could not be found in lobby!");
        }
        ;
        return user;
    }
    getAllLobbiesForDisplay() {
        const out = [];
        this._lobbies.forEach(lobby => {
            out.push({
                id: lobby.id,
                name: lobby.name,
                host: UserRepository_js_1.userRepository.getUserByID(lobby.hostID).username,
                type: lobby.type,
                capacity: {
                    taken: this._getParticipantsAm(lobby.users),
                    max: lobby.type === "tournament"
                        ? TournamentRepository_js_1.tournamentRepository.MAX_PARTICIPANTS
                        : this._getMaxPlayersFromMap(lobby.matchSettings.map)
                },
            });
        });
        return out;
    }
    _lobbies = [];
    _currentID = 0;
    _getParticipantsAm(users) {
        const participants = users.filter(user => user.player !== null);
        return participants.length;
    }
    _getMaxPlayersFromMap(map) {
        const [amountStr, type, _size] = map.split("-");
        const amount = Number(amountStr);
        return (amount * (type === "teams" ? 2 : 1));
    }
}
exports.lobbyRepository = new LobbyRepository();
