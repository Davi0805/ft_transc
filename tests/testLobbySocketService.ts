import { WebSocket } from "ws";
import { InboundDTOMap, OutboundDTO, OutboundDTOMap, TDynamicLobbySettings } from "./dependencies/lobbyTyping.js";
import { testLobbyRepository } from "./testLobbyRepository.js";

class TestLobbySocketService {
    constructor() {}

    updateSettings(lobbyID: number, newSettings: TDynamicLobbySettings) {
        const updatedUsers = testLobbyRepository.updateSettings(lobbyID, newSettings);
        this.broadcast(lobbyID, "updateSettings", {
            settings: newSettings,
            users: updatedUsers
        })
    }


    
    private _wsMap: Map<number, WebSocket[]> = new Map<number, WebSocket[]>
    addSocketToLobby(lobbyID: number,  ws: WebSocket) {
        const lobbySockets = this._wsMap.get(lobbyID)
        if (!lobbySockets) {
            this._wsMap.set(lobbyID, [ws])
        } else {
            lobbySockets.push(ws)
        }
    }
    broadcast<T extends keyof OutboundDTOMap>(lobbyID: number, reqType: T, data: OutboundDTOMap[T]) {
        console.log("Start broadcasting")
        const lobbySockets = this._wsMap.get(lobbyID);
        if (lobbySockets) {
            lobbySockets.forEach(ws => {
                const dto: OutboundDTO = {
                    requestType: reqType,
                    data: data
                }
                ws.send(JSON.stringify(dto))
            })
        }
    }
}

export const lobbySocketService = new TestLobbySocketService()