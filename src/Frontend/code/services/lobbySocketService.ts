import { TLobbyType } from "../api/lobbyMatchAPI/getLobbySettingsAPI";
import { authService } from "./authService";

class LobbySocketService {
    constructor() {
        this._ws = null;
        this._lobbyID = null;
        this._lobbyType = null;
        this._userID = null;
    }

    connect(lobbyID: number, lobbyType: TLobbyType, userID: number) {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            console.log("DEBUG: lobbySocket already connected");
            return;
        }

        this._ws = new WebSocket(`ws://localhost:8084/ws/${lobbyID}`, [`Bearer.${authService.getToken()}`]);
        this._lobbyID = lobbyID;
        this._lobbyType = lobbyType;
        this._userID = userID;

        this._ws.onopen = (ev: Event) => {
            console.log("DEBUG: lobbySocket connected");
        }
        
        this._ws.onmessage = (ev: MessageEvent) => {
            try {
                const data = JSON.parse(ev.data);
                this._handleMessage(data);
            } catch (error) {
                console.error("Error parsing websocket message");
            }
        }

        this._ws.onclose = (ev: CloseEvent) => {
            console.log("DEBUG: websocket closed:", ev.code, ev.reason);
            this._ws = null;
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

    send(data: unknown /*TODO*/) {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(JSON.stringify(data));
            return true;
        } else {
            console.log("DEBUG: WebSocket not connected, message not sent!");
            return false;
        }
    }

    private _ws: WebSocket | null;
    get ws(): WebSocket | null { return this._ws; }
    private _lobbyID: number | null;
    get lobbyID(): number | null { return this._lobbyID; }
    private _lobbyType: TLobbyType | null;
    get lobbyType(): TLobbyType | null { return this._lobbyType }
    private _userID: number | null;
    get userID(): number | null { return this._userID; }

    private _handleMessage(data: unknown /*TODO*/) {

    }

    
}

export const lobbySocketService = new LobbySocketService();