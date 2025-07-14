import { SelfData } from "../api/getSelfDataAPI";
import { LobbyPage } from "../pages/play/lobby";
import { TSlots } from "../pages/play/lobbyLogic";
import { TDynamicLobbySettings, TFriendlyPlayer, TLobby, TLobbyType, TMatchPlayer, TRankedPlayer, TTournamentPlayer, TTournPlayer, TUser } from "../pages/play/lobbyTyping";
import { getSlotsFromMap } from "../pages/play/utils/helpers";
import { lobbySocketService } from "./lobbySocketService";
import { matchService } from "./matchService";
import { router } from "../routes/router";


class LobbyService {
    initSettings(selfData: SelfData, settings: TLobby) {
        this._settings = settings;
        this._myID = selfData.id;
        
    }

    nullify() {
        this._settings = null;
        this._myID = null;
    }

    getSlots(): TSlots {
        if (!this._settings) { throw Error("getSlots should not be called before lobby is initialized!")}
        
        const mapSlots = getSlotsFromMap(this._settings.map);
        const matchPlayers = this.getMatchPlayers()

        matchPlayers.forEach(player => {
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
    updateSettingsIN(settings: TDynamicLobbySettings) {
        lobbySocketService.send("updateSettings", { settings: settings })
    }

    updateReadinessIN(ready: boolean) {
        lobbySocketService.send("updateReadiness", { ready: ready });
    }

    addFriendlyPlayerIN(player: TFriendlyPlayer) {
        lobbySocketService.send("addFriendlyPlayer", { player: player });
    }

    removeFriendlyPlayerIN(playerID: number) {
        lobbySocketService.send("removeFriendlyPlayer", { id: playerID });
    }

    addRankedPlayerIN(player: TRankedPlayer) {
        lobbySocketService.send("addRankedPlayer", { player: player })
    }

    removeRankedPlayerIN(playerID: number) {
        lobbySocketService.send("removeRankedPlayer", { id: playerID})
    }

    addTournPlayerIN() {
        //This request does not need any payload because every info is either taken from auth or has default values
        //Must add a TTournPlayer to the participating list. See the type definition for details
        lobbySocketService.send("addTournamentPlayer", null);
    }
    removeTournPlayerIN() {
        lobbySocketService.send("removeTournamentPlayer", null);
    }

    inviteUserToLobby(userID: number) {
        lobbySocketService.send("inviteUserToLobby", { userID: userID });
    }

    leave() {
        lobbySocketService.send("leaveLobby", null);
        lobbySocketService.disconnect();
        this.nullify();
    }

    startMatchIN() {
        lobbySocketService.send("startGame", null);
    }


    //outbound
    updateSettingsOUT(settings: TLobby) {
        this._settings = settings
        LobbyPage.renderSettings();
    }
    updateReadinessOUT(id: number, ready: boolean) {
        const user = this._findUserByID(id);
        user.ready = ready;
    }
    addLobbyUserOUT(user: TUser) {
        this._users.push(user);
    }
    removeLobbyUserOUT(id: number) {
        const user = this._findUserByID(id);
        const index = this._users.indexOf(user);
        this._users.splice(index, 1); //TODO: For tournament, this does not work!
    }
    addFriendlyPlayerOUT(userID: number, player: TFriendlyPlayer) {
        if (!this._isLobbyOfType("friendly")) { return; }
        
        const user = this._findUserByID(userID);
        (user.player as TFriendlyPlayer[]).push(player) // This is safe becuase the check is done above
        user.participating = true;
    }
    removeFriendlyPlayerOUT(playerID: number) {
        if (!this._isLobbyOfType("friendly")) { return; }

        for (let i = 0; i < this._users.length; i++) {
            const user = this._users[i];
            const players: TFriendlyPlayer[] = (user.player) as TFriendlyPlayer[];
            const player = players.find(player => player.id === playerID);
            if (player) {
                const index: number = players.indexOf(player);
                players.splice(index, 1);
                if (players.length === 0) {
                    user.participating = false;
                }
                return ;
            }
        }
        throw Error("The player requested was not found!");
    }
    addRankedPlayerOUT(userID: number, player: TRankedPlayer) {
        if (!this._isLobbyOfType("ranked")) { return; }

        const user = this._findUserByID(userID);
        user.player = player;
        user.participating = true;
    }
    removeRankedPlayerOUT(userID: number) {
        if (!this._isLobbyOfType("ranked")) { return; }
        const user = this._findUserByID(userID);
        user.participating = false;
    }
    addTournamentPlayer(userID: number) {
        if (!this._isLobbyOfType("tournament")) { return; }
        const user = this._findUserByID(userID);
        user.participating = true;
        (user.player as TTournamentPlayer).applied = true;
    }
    removeTournamentPlayer(userID: number) {
        if (!this._isLobbyOfType("tournament")) { return; }
        const user = this._findUserByID(userID);
        (user.player as TTournamentPlayer).applied = false;
    }
    startMatchOUT() {
        
    }



    getMatchPlayers(): TMatchPlayer[] {
        const out: TMatchPlayer[] = []
        if (this._isLobbyOfType("friendly")) {
            this._users.forEach(user => {
                if (user.participating) {
                    const players = user.player as TFriendlyPlayer[]
                    players.forEach(player => {
                        out.push({
                            userID: user.id,
                            id: player.id,
                            nickname: player.nickname,
                            spriteID: player.spriteID,
                            team: player.team,
                            role: player.role,
                            ready: user.ready
                        })
                    })
                }
                
            })
        } else if (this._isLobbyOfType("ranked")) {
            this._users.forEach(user => {
                if (user.participating) {
                    const player = user.player as TRankedPlayer;
                    out.push({
                        userID: user.id,
                        id: user.id,
                        nickname: user.nickname,
                        spriteID: user.spriteID,
                        team: player.team,
                        role: player.role,
                        ready: user.ready
                    })
                }
            })
        } else { throw Error("Function called in wrong lobby type")}
        return out;
    }
    getTournPlayers(): TTournPlayer[] {
        if (!this._isLobbyOfType("tournament")) {throw Error("Function called in wrong lobby type")}

        const out: TTournPlayer[] = [];
        this._users.forEach(user => {
            const player = user.player as TTournamentPlayer;
            if (player.applied) {
                out.push({
                    id: user.id,
                    nick: user.nickname,
                    score: player.score,
                    rating: user.rating,
                    prevOpponents: player.prevOpponents,
                    teamDist: player.teamDist,
                    participating: user.participating,
                    ready: user.ready
                })
            }
        })
        return out
    }

    amIHost(): boolean {
        return this.myID === this.settings.hostID
    }
    isEveryoneReady(): boolean {
        return this._users.find(user => (user.participating === true && user.ready === false)) ? false : true
    }
    amIParticipating(): boolean {
        const me = this._users.find(user => user.id == this.myID);
        if (!me) {throw Error("How can't I be in the lobby???"); }
        return me.participating;
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
    private _users: TUser[] = [];

    _findUserByID(userID: number): TUser {
        const user = this._users.find(user => user.id === userID);
        if (!user) { throw Error("User requested was not found in lobby!"); }
        return user
    }
    _isLobbyOfType(desiredType: TLobbyType) {
        if (this.settings.type !== desiredType) {
            console.error("This lobby's type is not the expected one!");
            return false;
        }
        return true
    }
}

export const lobby = new LobbyService();