import Sprite from "../../../../TempIsolatedMatchLogic/src/client/scripts/system/framework/Sprite";
import { getSelfData } from "../api/getSelfDataAPI";
import { getLobbySettingsByID } from "../api/lobbyMatchAPI/getLobbySettingsAPI";
import { TSlots } from "../pages/play/lobbyLogic";
import { TMatchPlayer, TStaticLobbySettings, TTournPlayer } from "../pages/play/lobbyTyping";
import { getSlotsFromMap } from "../pages/play/utils/helpers";
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
        const mapSlots = getSlotsFromMap(await lobbySocketService.sendRequest("GETselectedMap", null))
        const participatingPlayers = await lobbySocketService.sendRequest("GETmatchPlayers", null);
        participatingPlayers.forEach(player => {
            if (mapSlots[player.team] === undefined || mapSlots[player.team]![player.role] === undefined) {
                throw Error("Fuck everything about this bullshit")
            }
            if (!player.id || !player.spriteID) {
                throw Error("Player should have been initialized by backend at this point!")
            }
            if (mapSlots[player.team]![player.role] === null) {
                mapSlots[player.team]![player.role] = {
                    id: player.id,
                    spriteID: player.spriteID
                }
            }
            mapSlots[player.team]
        })
        return mapSlots
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