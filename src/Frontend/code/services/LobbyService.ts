import { getSelfData } from "../api/getSelfDataAPI";
import { getLobbySettingsByID } from "../api/lobbyMatchAPI/getLobbySettingsAPI";
import { TSlots } from "../pages/play/lobbyLogic";
import { TMatchPlayer, TStaticLobbySettings, TTournPlayer } from "../pages/play/lobbyTyping";
import { lobbySocketService } from "./lobbySocketService";

class LobbyService {
    async setSettings(lobbyID: number) {
        const settings = await getLobbySettingsByID(lobbyID);
        const selfData = await getSelfData();

        this._staticSettings = {
            id: settings.id,
            hostID: settings.hostID,
            name: settings.name,
            host: settings.host,
            type: settings.type
        }
        this._amIHost = selfData.id === settings.hostID
    }

    async amIParticipating(): Promise<boolean> {
        return await lobbySocketService.sendRequest("GETamIParticipating", null)
    }

    async isEveryoneReady(): Promise<boolean> {
        return await lobbySocketService.sendRequest("GETisEveryoneReady", null);
    }

    async updateMyReadiness(ready: boolean) {
        return await lobbySocketService.sendRequest("POSTupdateMyReadiness", ready);
    }

    async getSlots(): Promise<TSlots> {
        const participatingPlayers = await lobbySocketService.sendRequest("GETparticipatingPlayers", null);
        //TODO: convert participating players into slots
        return {}
    }

    async addMatchPlayer(player: TMatchPlayer) {
        //TODO: WEBSOCKET
    }


    async getTournParticipants(): Promise<TTournPlayer[]> {
        //TODO: WEBSOCKET
        return []
    }

    async getCurrentRoundNumber(): Promise<number> {
        //TODO: WEBSOCKET
        return 1
    }

    async leave() {
        //TODO: tell db that player is not participating anymore!
        //TODO: ADD COMM TO DB THAT PLAYER LEFT
        //TODO: CLOSE WEBSOCKET AND SERVICE
    }

    private _staticSettings: TStaticLobbySettings | null = null;
    get staticSettings(): TStaticLobbySettings | null { return this._staticSettings; }
    private _amIHost: boolean = false;
    get amIHost(): boolean { return this._amIHost; }
}

export const lobby = new LobbyService();