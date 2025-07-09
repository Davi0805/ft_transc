import { getLobbySettings, getLobbySettingsByID } from "../api/lobbyMatchAPI/getLobbySettingsAPI";
import { TStaticLobbySettings } from "../pages/play/lobbyTyping";

class LobbyService {

    async setSettings(lobbyID: number) {
        const settings = await getLobbySettingsByID(lobbyID);
        this._staticSettings = {
            id: settings.id,
            hostID: settings.hostID,
            name: settings.name,
            host: settings.host,
            type: settings.type
        }
    }

    private _staticSettings: TStaticLobbySettings | null = null;
    get staticSettings(): TStaticLobbySettings | null { return this._staticSettings; }
}

export const lobby = new LobbyService();