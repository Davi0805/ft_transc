import { WebSocket } from "ws";
import { InboundDTO, InboundDTOMap, OutboundDTO, OutboundDTOMap, TDynamicLobbySettings, TFriendlyPlayer, TRankedPlayer, TTournamentPlayer } from "./dependencies/lobbyTyping.js";
import { testLobbyRepository } from "./testLobbyRepository.js";

class TestLobbySocketService {
    constructor() {}

    handleMessage(lobbyID: number, senderID: number, dto: InboundDTO) {
        switch (dto.requestType) {
            case "updateSettings":
                this.updateSettings(lobbyID, dto.data.settings)
                break;
            case "inviteUserToLobby":
                this.inviteUserToLobby(lobbyID, dto.data.userID)
                break;
            case "updateReadiness":
                this.updateReadiness(lobbyID, senderID, dto.data.ready)
                break;
            case "addFriendlyPlayer":
                this.addFriendlyPlayer(lobbyID, senderID, dto.data.player)
                break;
            case "removeFriendlyPlayer":
                this.removeFriendlyPlayer(lobbyID, senderID, dto.data.playerID)
                break;
            case "addRankedPlayer":
                this.addRankedPlayer(lobbyID, senderID, dto.data.player)
                break;
            case "removeRankedPlayer":
                this.removeRankedPlayer(lobbyID, senderID)
                break
            case "addTournamentPlayer":
                this.addTournamentPlayer(lobbyID, senderID)
                break;
            case "removeTournamentPlayer":
                this.removeTournamentPlayer(lobbyID, senderID)
                break;
            default:
                throw Error("dto type not found!")
        }
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



    updateSettings(lobbyID: number, newSettings: TDynamicLobbySettings) {
        const updatedUsers = testLobbyRepository.updateSettings(lobbyID, newSettings);
        this.broadcast(lobbyID, "updateSettings", {
            settings: newSettings,
            users: updatedUsers
        })
    }

    inviteUserToLobby(lobbyID: number, inviteeID: number) {
        //TODO
    }

    updateReadiness(lobbyID: number, senderID: number, ready: boolean) {
        testLobbyRepository.updateReadiness(lobbyID, senderID, ready);
        this.broadcast(lobbyID, "updateReadiness", {
            userID: senderID,
            ready: ready
        })
    }
    addFriendlyPlayer(lobbyID: number, senderID: number, player: TFriendlyPlayer) {
        testLobbyRepository.addFriendlyPlayer(lobbyID, senderID, player);
        this.broadcast(lobbyID, "addFriendlyPlayer", {
            userID: senderID,
            player: player
        })
    }
    removeFriendlyPlayer(lobbyID: number, senderID: number, playerID: number) {
        testLobbyRepository.removeFriendlyPlayer(lobbyID, senderID, playerID);
        this.broadcast(lobbyID, "removeFriendlyPlayer", {
            playerID: playerID
        })
    }
    addRankedPlayer(lobbyID: number, senderID: number, player: TRankedPlayer) {
        testLobbyRepository.addRankedPlayer(lobbyID, senderID, player);
        this.broadcast(lobbyID, "addRankedPlayer", {
            userID: senderID,
            player: player
        })
    }
    removeRankedPlayer(lobbyID: number, senderID: number) {
        testLobbyRepository.removeRankedPlayer(lobbyID, senderID);
        this.broadcast(lobbyID, "removeRankedPlayer", {
            id: senderID
        })
    }
    addTournamentPlayer(lobbyID: number, senderID: number) {
        const player = testLobbyRepository.addTournamentPlayer(lobbyID, senderID)
        this.broadcast(lobbyID, "addTournamentPlayer", {
            userID: senderID,
            player: player
        })
    }
    removeTournamentPlayer(lobbyID: number, senderID: number) {
        testLobbyRepository.removeTournamentPlayer(lobbyID, senderID);
        this.broadcast(lobbyID, "removeTournamentPlayer", {
            id: senderID
        })
    }
}

export const lobbySocketService = new TestLobbySocketService()