import { CAppConfigs } from "../match/matchSharedDependencies/SetupDependencies";
import { InboundDTOMap, InboundDTO, OutboundDTO, TLobby } from "../pages/play/lobbyTyping";
import { authService } from "./authService";
import { lobbyService } from "./LobbyService";
import { matchService } from "./matchService";
import { tournamentService, TTournamentDTO } from "./tournamentService";

type TLobbyInfo = {
    lobby: TLobby,
    matchConfigs: CAppConfigs | null,
    tournamentConfigs: TTournamentDTO | null
}

class LobbySocketService {
    constructor() {
        this._ws = null;
        this._lobbyID = 0;
    }

    connect(lobbyID: number): Promise<TLobbyInfo | null> {
        return new Promise((resolve, _reject) => {
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
                let data: OutboundDTO | null = null;
                try {
                    data = JSON.parse(ev.data) as OutboundDTO;
                } catch (error) {
                    console.error("Error parsing websocket message");
                }
                if (!data) {return}
                if (data.requestType === "lobbyInit") {
                        resolve(data.data);
                } else {
                    this._handleMessage(data)
                }
            }

            this._ws.onclose = (ev: CloseEvent) => {
                console.log("DEBUG: websocket closed:", ev.code, ev.reason);
                lobbyService.destroy();
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
            //Lobby messages
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
                lobbyService.removeLobbyUserOUT(dto.data.userID)
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
                lobbyService.removeRankedPlayerOUT(dto.data.userID);
                break;
            case "addTournamentPlayer":
                lobbyService.addTournamentPlayerOUT(dto.data.userID);
                break;
            case "removeTournamentPlayer":
                lobbyService.removeTournamentPlayerOUT(dto.data.userID);
                break;
            case "returnToLobby":
                lobbyService.return(dto.data.lobby)
                break;
            case "actionBlock":
                lobbyService.handleActionBlock(dto.data.reason)
                break;
            //match messages
            case "startMatch":
                matchService.startMatchOUT(dto.data.configs);
                break;
            case "updateGame":
                matchService.updateGame(dto.data);
                break;
            case "endOfMatch":
                matchService.onEndOfMatch(dto.data.result);
                break;
            // tournament messages
            case "startTournament":
                tournamentService.startTournamentOUT();
                break;
            case "displayStandings": 
                tournamentService.displayStandingsOUT(dto.data.standings);
                break;
            case "displayPairings":
                tournamentService.displayPairingsOUT(dto.data.pairings)
                break;
            case "updateTournamentResult":
                tournamentService.updateMatchResultOUT(dto.data.matchIndex, dto.data.winnerID);
                break;
            case "displayResults":
                tournamentService.displayResultsOUT();
                break;
            case "displayTournamentEnd":
                tournamentService.displayStandingsOUT(dto.data.standings);
                break;
            default:
                throw Error(dto.requestType)
        }
    }
}

export const lobbySocketService = new LobbySocketService();