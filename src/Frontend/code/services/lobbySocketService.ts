import { authService } from "./authService";

class LobbySocketService {
    constructor() {
        this._ws = null;
        this._lobbyID = -1;
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
    private _lobbyID: number;
    get lobbyID(): number { return this._lobbyID; }

    private _handleMessage(data: unknown /*TODO*/) {

    }

    
}

export const lobbySocketService = new LobbySocketService();