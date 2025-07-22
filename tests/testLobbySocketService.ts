import { WebSocket } from "ws";
import { InboundDTO, InboundDTOMap, OutboundDTO, OutboundDTOMap, TDynamicLobbySettings, TFriendlyPlayer, TRankedPlayer, TTournamentPlayer } from "./dependencies/lobbyTyping.js";
import { testLobbyRepository } from "./testLobbyRepository.js";
import { testMatchService } from "./testMatchService.js";
import { CGameDTO } from "./dependencies/dtos.js";

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
            case "startGame":
                this.startGame(lobbyID, senderID)
                break;
            case "updateGame":
                this.updateGame(senderID, dto.data);
                break;
            default:
                throw Error("dto type not found!")
        }
    }
    
    private _wsMap: Map<number, Map<number, WebSocket> > = new Map<number, Map<number, WebSocket>>()
    addSocketToLobby(lobbyID: number, userID: number, ws: WebSocket) {
        console.log("lobby adds")
        const lobbySockets = this._wsMap.get(lobbyID)
        if (!lobbySockets) {
            console.log("lobby creates")
            const map = new Map<number, WebSocket>()
            map.set(userID, ws);
            this._wsMap.set(lobbyID, map)
        } else {
            console.log("Lobby exists")
            testLobbyRepository.addUserToLobby(lobbyID, {id: userID, username: "lol"})
            lobbySockets.set(userID, ws)
        }
    }
    sendToUser<T extends keyof OutboundDTOMap>(userID: number, reqType: T, data: OutboundDTOMap[T]) {
        const ws = this.getWsFromUserID(userID);
        const dto: OutboundDTO = {
            requestType: reqType,
            data: data
        }
        ws.send(JSON.stringify(dto))
    }
    broadcast<T extends keyof OutboundDTOMap>(lobbyID: number, reqType: T, data: OutboundDTOMap[T]) {
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
    getWsFromUserID(userID: number): WebSocket {
        for (const lobbySockets of this._wsMap.values()) {
            const ws = lobbySockets.get(userID);
            if (ws) { return ws; }
        }
        throw Error("This userID is not present in any lobby!!")
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
    startGame(lobbyID: number, senderID: number) {
        //TODO
        const lobby = testLobbyRepository.getLobbyByID(lobbyID)
        testMatchService.startMatch(lobby)
    }

    updateGame(senderID: number, controlsDTO: CGameDTO) {
        testMatchService.updateControlsState(senderID, controlsDTO)
    }
}

export const lobbySocketService = new TestLobbySocketService()