import { testLobbyRepository } from "./testLobbyRepository.js";
class TestLobbySocketService {
    constructor() { }
    updateSettings(lobbyID, newSettings) {
        testLobbyRepository.updateSettings(lobbyID, newSettings);
        this.broadcast("updateSettings", {
            settings: newSettings,
            users: null
        });
    }
    _wsArray = [];
    addSocket(ws) {
        this._wsArray.push(ws);
    }
    broadcast(type, data) {
        this._wsArray.forEach(ws => {
            const dto = {
                requestType: type,
                data: data
            };
            ws.send(JSON.stringify(dto));
        });
    }
}
export const lobbySocketService = new TestLobbySocketService();
