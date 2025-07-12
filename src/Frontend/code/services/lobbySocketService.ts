import { InboundDTOMap, InboundDTO, OutboundDTO, OutboundDTOMap } from "../pages/play/lobbyTyping";
import { authService } from "./authService";
import { lobby } from "./LobbyService";

class LobbySocketService {
    constructor() {
        this._ws = null;
        this._lobbyID = 0; //TODO change to null
    }

    connect(lobbyID: number) {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            console.log("DEBUG: lobbySocket already connected");
            return;
        }

        this._ws = new WebSocket(`ws://localhost:8084/ws/${lobbyID}`, [`Bearer.${authService.getToken()}`]);
        this._lobbyID = lobbyID;

        this._ws.onopen = (ev: Event) => {
            console.log("DEBUG: lobbySocket connected");
        }
        
        this._ws.onmessage = (ev: MessageEvent) => {
            try {
                const data = JSON.parse(ev.data) as OutboundDTO;
                this._handleMessage(data)
            } catch (error) {
                console.error("Error parsing websocket message");
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
                lobbyID: lobbySocketService.lobbyID,
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
    get ws(): WebSocket | null { return this._ws; }
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
                lobby.updateSettings(dto.data.settings);
                break;
            case "updatePlayers":
                lobby.updatePlayers(dto.data.players);
                break;
            case "startMatch":
                lobby.startMatchOutbound(dto.data.settings, dto.data.players);
                break;
            default:
                throw Error("A message came in with a non registered type!!")
        }
    }
}

export const lobbySocketService = new LobbySocketService();