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
        await lobbySocketService.sendRequest("POSTupdateMyReadiness", ready);
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
        await lobbySocketService.sendRequest("POSTaddMatchPlayer", player);
    }

    async addTournPlayer() {
        //This request does not need any payload because every info is either taken from auth or has default values
        //Must add a TTournPlayer to the participating list. See the type definition for details
        await lobbySocketService.sendRequest("POSTaddTournPlayer", null);
    }

    async removeTournPlayer() {
        //Sets participating to false, so it does not get paired, but does not remove it from the db, so it still gets in the final classification table
        await lobbySocketService.sendRequest("POSTwithdrawTournPlayer", null);
    }

    async getTournParticipants(): Promise<TTournPlayer[]> {
        return await lobbySocketService.sendRequest("GETtournPlayers", null);
    }

    async getCurrentRoundNumber(): Promise<number> {
        return await lobbySocketService.sendRequest("GETcurrentRoundNo", null);
    }

    async leave() {
        await lobbySocketService.sendRequest("POSTleaveLobby", null);
        //TODO: tell db that player is not participating anymore! (Davi)
        //TODO: ADD COMM TO DB THAT PLAYER LEFT (Davi)
        //TODO: CLOSE WEBSOCKET AND SERVICE (Nuno)
    }

    private _staticSettings: TStaticLobbySettings | null = null;
    get staticSettings(): TStaticLobbySettings | null { return this._staticSettings; }
    private _amIHost: boolean = false;
    get amIHost(): boolean { return this._amIHost; }
}

export const lobby = new LobbyService();