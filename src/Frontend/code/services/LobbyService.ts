import { getSelfData, SelfData } from "../api/getSelfDataAPI";
import { LobbyPage } from "../pages/play/lobby";
import { TSlots, LobbyLogic } from "../pages/play/lobbyLogic";
import { TDynamicLobbySettings, TLobby, TMatchPlayer, TStaticLobbySettings, TTournPlayer } from "../pages/play/lobbyTyping";
import { getSlotsFromMap } from "../pages/play/utils/helpers";
import { lobbySocketService } from "./lobbySocketService";
import { matchService } from "./matchService";
import { router } from "../routes/router";


class LobbyService {
    initSettings(selfData: SelfData, settings: TLobby) {
        this._settings = settings;
        this._myID = selfData.id;
        this._amIHost = selfData.id === this._settings.hostID
        if (this._settings.type === "tournament") {
            this._tournPlayers = [];
        } else {
            this._matchPlayers = [];
        }
    }

    nullify() {
        this._settings = null;
        this._myID = null;
        this._amIHost = false;
        this._everyoneReady = false;
        this._tournPlayers = null;
        this._matchPlayers = null;
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

    //inbound
    updateSettingsInbound(settings: TDynamicLobbySettings) {
        lobbySocketService.send("updateSettings", { settings: settings })
    }

    updateMyReadiness(ready: boolean) {
        lobbySocketService.send("updateMyReadiness", { ready: ready });
    }

    addMatchPlayer(player: TMatchPlayer) {
        lobbySocketService.send("addMatchPlayer", { player: player });
    }

    removeMatchPlyer(playerID: number) {
        lobbySocketService.send("removeMatchPlayer", { playerID: playerID }); //TODO: need to know which player to remove
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
        lobbySocketService.disconnect();
        this.nullify();
    }

    startMatchInbound() {
        lobbySocketService.send("startGame", null);
    }


    //outbound
    updateSettingsOutbound(settings: TLobby) {
        this._settings = settings
        LobbyPage.renderSettings();
    }

    updatePlayers(players: TMatchPlayer[] | TTournPlayer[]) {
        if (this.settings.type === "tournament") {
            this._tournPlayers = players as TTournPlayer[];
            this._participating = this._tournPlayers.find(player => player.id === this._myID) ? true : false;
            this._everyoneReady = this._tournPlayers.find(player => player.ready === false) ? false : true
            LobbyPage.renderParticipants()
        } else {
            this._matchPlayers = players as TMatchPlayer[];
            this._participating = this._matchPlayers.find(player => player.userID === this._myID) ? true : false;
            this._everyoneReady = this._matchPlayers.find(player => player.ready === false) ? false : true
            LobbyPage.renderSlots()
        }
    }

    startMatchOutbound(settings: TLobby, players: TMatchPlayer[] | TTournPlayer[]) { //Is it necessary to send these or can each client pick from the locally saved data?
        if (settings.type == "tournament") {
            LobbyLogic.prepareNextRound(settings);
        } else {
            const userCustoms = LobbyLogic.buildUserCustoms(settings, lobby.matchPlayers);
            matchService.injectConfigs(userCustoms);
            router.navigateTo("/match");
        }
    }

    private _settings: TLobby | null = null;
    get settings(): TLobby {
        if (!this._settings) { throw Error("Settings are trying to be accessed when lobby hasn't been initialized yet!"); }
        return this._settings;
    }
    private _myID: number | null = null;
    get myID(): number {
        if (this._myID === null) { throw Error("myID is not initialized!"); }
        return this._myID;
    }
    private _amIHost: boolean = false;
    get amIHost(): boolean { return this._amIHost; }
    private _participating: boolean = false;
    get participating(): boolean { return this._participating; }
    private _everyoneReady: boolean = false;
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