import { WebSocket } from "ws";
import { InboundDTOMap, OutboundDTO, OutboundDTOMap, TDynamicLobbySettings } from "./dependencies/lobbyTyping.js";
import { testLobbyRepository } from "./testLobbyRepository.js";

class TestLobbySocketService {
    constructor() {}

    updateSettings(lobbyID: number, newSettings: TDynamicLobbySettings) {
        const updatedUsers = testLobbyRepository.updateSettings(lobbyID, newSettings);
        this.broadcast("updateSettings", {
            settings: newSettings,
            users: updatedUsers
        })
    }


    
    private _wsArray: WebSocket[] = []
    addSocket(ws: WebSocket) {
        this._wsArray.push(ws)
    }
    broadcast<T extends keyof OutboundDTOMap>(type: T, data: OutboundDTOMap[T]) {
        this._wsArray.forEach(ws => {
            const dto: OutboundDTO = {
                requestType: type,
                data: data
            }
            ws.send(JSON.stringify(dto))
        })
    }
}

export const lobbySocketService = new TestLobbySocketService()