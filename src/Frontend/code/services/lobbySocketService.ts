import { InboundDTOMap, InboundDTO, OutboundDTO, OutboundDTOMap, TLobby } from "../pages/play/lobbyTyping";
import { authService } from "./authService";
import { lobbyService } from "./LobbyService";
import { App } from "../match/system/App";
import { matchService } from "./matchService";

class LobbySocketService {
    constructor() {
        this._ws = null;
        this._lobbyID = 0; //TODO change to null
    }

    connect(lobbyID: number): Promise<TLobby | null> {
        return new Promise((resolve, reject) => {
            if (this._ws && this._ws.readyState === WebSocket.OPEN) {
                console.log("DEBUG: lobbySocket already connected");
                resolve(null);
                return;
            }

            this._ws = new WebSocket(`ws://localhost:8084/ws/${lobbyID}`, [`Bearer.${authService.getToken()}`]);
            this._lobbyID = lobbyID;

            this._ws.onopen = (ev: Event) => {
                console.log("DEBUG: lobbySocket connected");
            }
            
            this._ws.onmessage = (ev: MessageEvent) => {
                console.log("Message received: " + ev.data)
                let data: OutboundDTO | null = null;
                try {
                    data = JSON.parse(ev.data) as OutboundDTO;
                } catch (error) {
                    console.error("Error parsing websocket message");
                }
                if (!data) {return}
                if (data.requestType === "lobby") {
                    resolve(data.data);
                } else {
                    this._handleMessage(data)
                }
            }

            this._ws.onclose = (ev: CloseEvent) => {
                console.log("DEBUG: websocket closed:", ev.code, ev.reason);
                this._ws = null;
                this._lobbyID = null;
            };

            this._ws.onerror = (error: Event) => {
                console.error("DEBUG: WebSocket error:", error);
            };
        })
        
    }

    disconnect() {
        if (this._ws) {
            this._ws.close(1000, "User Disconnected")
            this._ws = null;
        }
    }

    send<T extends keyof InboundDTOMap>(type: T, data: InboundDTOMap[T]) {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            const dto: InboundDTO = {
                requestType: type,
                data: data
            }
            this._ws.send(JSON.stringify(dto));
            return true;
        } else {
            console.log("DEBUG: WebSocket not connected, message not sent!");
            return false;
        }
    }

    private _ws: WebSocket | null;
    get ws(): WebSocket {
        if (!this._ws) { throw Error("Socket was accessed but was not initialized!")}
        return this._ws;
    }
    private _lobbyID: number | null;
    get lobbyID(): number {
        if (this._lobbyID === null) {
            throw Error("LobbyID was accessed without being initialized!")
        }
        return this._lobbyID;
    }

    private _handleMessage(dto: OutboundDTO) {
        switch (dto.requestType) {
            case "updateSettings":
                lobbyService.updateSettingsOUT(dto.data.settings, dto.data.users);
                break;
            case "updateReadiness":
                lobbyService.updateReadinessOUT(dto.data.userID, dto.data.ready)
                break;
            case "addLobbyUser":
                lobbyService.addLobbyUserOUT(dto.data.user)
                break;
            case "removeLobbyUser":
                lobbyService.removeLobbyUserOUT(dto.data.id)
                break;
            case "addFriendlyPlayer":
                lobbyService.addFriendlyPlayerOUT(dto.data.userID, dto.data.player)
                break;
            case "removeFriendlyPlayer":
                lobbyService.removeFriendlyPlayerOUT(dto.data.playerID);
                break;
            case "addRankedPlayer":
                lobbyService.addRankedPlayerOUT(dto.data.userID, dto.data.player)
                break;
            case "removeRankedPlayer":
                lobbyService.removeRankedPlayerOUT(dto.data.id);
                break;
            case "addTournamentPlayer":
                lobbyService.addTournamentPlayerOUT(dto.data.userID, dto.data.player);
                break;
            case "removeTournamentPlayer":
                lobbyService.removeTournamentPlayerOUT(dto.data.id);
                break;
            case "displayPairings":
                lobbyService.displayPairingsOUT(dto.data.pairings);
                break;
            case "startMatch":
                lobbyService.startMatchOUT(dto.data.configs);
                break;
            case "updateGame":
                App.severUpdate(dto.data)
                break;
            default:
                throw Error(`A message came in with a non registered type!! (${dto.requestType})`)
        }
    }
}

export const lobbySocketService = new LobbySocketService();