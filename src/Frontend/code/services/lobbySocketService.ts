import { lobbyRequestDTO, lobbyResponseDTO, RequestResponseMap } from "../pages/play/lobbyTyping";
import { authService } from "./authService";

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
                const data = JSON.parse(ev.data) as lobbyResponseDTO;
                const resolver = this._pendingRequests.get(data.requestID) 
                if (resolver) {
                    resolver(data.data); //Not 100% typesafe, but fuck it, gotta trust backend at some point
                    this._pendingRequests.delete(data.requestID);
                }
                
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

    async sendRequest<K extends keyof RequestResponseMap>(
        type: K,
        data: RequestResponseMap[K]['request']
    ): Promise<RequestResponseMap[K]['response']> {
        const currentLobbyID = this._lobbyID;
        if (currentLobbyID === null) {
            throw Error("Websocket not connected!!")
        }
        const uid = this._uid++;
        return new Promise((resolve) => {
            this._pendingRequests.set(uid, resolve);
            this.send({
                requestType: type,
                lobbyID: currentLobbyID,
                requestID: uid,
                data: data
            })
        })
    }

    send(data: lobbyRequestDTO) {
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
    get lobbyID(): number {
        if (this._lobbyID === null) {
            throw Error("LobbyID was accessed without being initialized!")
        }
        return this._lobbyID;
    }
    
    private _pendingRequests = new Map<number, (response: any) => void>(); //TODO how to type response?
    private _uid: number = 0;

    private _handleMessage(data: unknown /*TODO*/) {

    }

    
}

export const lobbySocketService = new LobbySocketService();