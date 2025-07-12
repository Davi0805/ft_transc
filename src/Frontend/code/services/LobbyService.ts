import { getSelfData, SelfData } from "../api/getSelfDataAPI";
import { getLobbySettingsByID } from "../api/lobbyMatchAPI/getLobbySettingsAPI";
//import { getLobbySettingsByID } from "../api/lobbyMatchAPI/getLobbySettingsAPI";
import { TSlots } from "../pages/play/lobbyLogic";
import { TDynamicLobbySettings, TLobby, TMatchPlayer, TStaticLobbySettings, TTournPlayer } from "../pages/play/lobbyTyping";
import { getSlotsFromMap } from "../pages/play/utils/helpers";
import { lobbySocketService } from "./lobbySocketService";


class LobbyService {
    async initSettings(lobbyID: number) {
        //It is important to get this from the backend on demand. This way nothing is written by the client whatsoever and there is no desync or common responsibilities
        const selfData: SelfData = { //await getSelfData(); TODO: uncomment
            id: 0,
            nickname: "Fucker McDickFace"
        }
        this._settings = { //await getLobbySettingsByID(lobbyID); TODO: Uncomment
            id: 0,
            hostID: 0,
            name: "fdp",
            host: "lolada",
            type: "ranked",
            capacity: { taken: 0, max: 8 },
            map: "4-players-big",
            mode: "classic",
            duration: "blitz",
            round: 1
        }
        this._amIHost = selfData.id === this._settings.hostID
        if (this._settings.type === "tournament") {
            this._tournPlayers = [];
        } else {
            this._matchPlayers = [];
        }
    }

    getSlots(): TSlots {
        if (!this._settings) { throw Error("getSlots should not be called before lobby is initialized!")}
        
        const mapSlots = getSlotsFromMap(this._settings.map);
        this.matchPlayers.forEach(player => {
            if (mapSlots[player.team] === undefined || mapSlots[player.team]![player.role] === undefined) {
                throw Error("Fuck everything about this bullshit")
            }
            if (player.id === null || player.spriteID === null) {
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

    updateMyReadiness(ready: boolean) {
        lobbySocketService.send("updateMyReadiness", { ready: ready });
    }

    addMatchPlayer(player: TMatchPlayer) {
        lobbySocketService.send("addMatchPlayer", { player: player });
    }

    removeMatchPlyer() {
        lobbySocketService.send("removeMatchPlayer", null); //TODO: need to know which player to remove
    }

    addTournPlayer() {
        //This request does not need any payload because every info is either taken from auth or has default values
        //Must add a TTournPlayer to the participating list. See the type definition for details
        lobbySocketService.send("addTournPlayer", null);
    }
    withdrawTournPlayer() {
        lobbySocketService.send("withdrawTournPlayer", null);
    }

    inviteUserToLobby(userID: number) {
        lobbySocketService.send("inviteUserToLobby", { userID: userID });
    }

    leave() {
        lobbySocketService.send("leaveLobby", null);
        //TODO: tell db that player is not participating anymore! (Davi)
        //TODO: ADD COMM TO DB THAT PLAYER LEFT (Davi)
        lobbySocketService.disconnect();
        this._settings = null;
        this._amIHost = false;
    }

    private _settings: TLobby | null = null;
    get settings(): TLobby {
        if (!this._settings) { throw Error("Settings are trying to be accessed when lobby hasn't been initialized yet!"); }
        return this._settings;
    }
    private _amIHost: boolean = false;
    get amIHost(): boolean { return this._amIHost; }
    private _participating: boolean = false; //TODO: needs an update function from socket
    get participating(): boolean { return this._participating; }
    private _everyoneReady: boolean = true; //TODO: needs an update function from socket
    get everyoneReady(): boolean { return this._everyoneReady; }

    //These should definitely be children of some parent class lol. Fuck it
    private _matchPlayers: TMatchPlayer[] | null = null;
    get matchPlayers(): TMatchPlayer[] {
        if (!this._matchPlayers) { throw Error("Match players are not initialized when they should!"); }
        return this._matchPlayers;
    }
    private _tournPlayers: TTournPlayer[] | null = null;
    get tournPlayers(): TTournPlayer[] {
        if (!this._tournPlayers) { throw Error("Tournament players are not initialized when they should!"); }
        return this._tournPlayers;
    }
}

export const lobby = new LobbyService();