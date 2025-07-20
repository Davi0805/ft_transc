class LobbyRepository {
    constructor() { }
    getLobbiesList() {
        console.log("getAllLobbies called");
        console.log(`Lobbies: ${this._lobbies}`);
        const out = [];
        this._lobbies.forEach(lobby => {
            out.push({
                id: lobby.id,
                name: lobby.name,
                host: this._getUserByID(lobby.hostID).username,
                type: lobby.type,
                capacity: {
                    taken: 0, //TODO
                    max: 0, //TODO
                },
                map: lobby.map,
                mode: lobby.mode,
                duration: lobby.duration
            });
        });
        return out;
    }
    createLobby(configs, selfData) {
        let userInfo = this._users.find(user => user.id === selfData.id);
        if (!userInfo) {
            userInfo = {
                id: selfData.id,
                username: selfData.username,
                spriteID: 0,
                rating: 1500
            };
            this._users.push(userInfo);
        }
        const newLobby = {
            id: this._currentLobbyID++,
            hostID: selfData.id,
            name: configs.name,
            type: configs.type,
            map: configs.map,
            mode: configs.mode,
            duration: configs.duration,
            round: 1,
            users: [{
                    id: userInfo.id,
                    username: userInfo.username,
                    spriteID: userInfo.spriteID,
                    rating: userInfo.rating,
                    ready: false,
                    player: null
                }]
        };
        this._lobbies.push(newLobby);
        return newLobby;
    }
    updateSettings(lobbyID, settings) {
        const lobby = this._getLobbyByID(lobbyID);
        lobby.map = settings.map;
        lobby.mode = settings.mode;
        lobby.duration = settings.duration;
    }
    _getLobbyByID(lobbyID) {
        const correctLobby = this._lobbies.find(lobby => lobby.id === lobbyID);
        if (!correctLobby) {
            throw Error("Lobby requested does not exist!");
        }
        return correctLobby;
    }
    _getUserByID(userID) {
        const correctUser = this._users.find(user => user.id === userID);
        if (!correctUser) {
            throw Error("Lobby requested does not exist!");
        }
        return correctUser;
    }
    _lobbies = [];
    _currentLobbyID = 0;
    _users = [];
}
export const testLobbyRepository = new LobbyRepository();
