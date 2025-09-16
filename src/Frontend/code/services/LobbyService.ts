import { LobbyPage } from "../pages/play/lobby";
import { TSlots } from "../pages/play/utils/helpers";
import { getSlotsFromMap } from "../pages/play/utils/helpers";
import { lobbySocketService } from "./lobbySocketService";
import { router } from "../routes/router";
import { matchService} from "./matchService";
import { TLobby, TDynamicLobbySettings, TLobbyUser, TFriendlyPlayer, TRankedPlayer, TTournamentPlayer, TLobbyType, TTournamentParticipant, TMatchPlayer } from "../pages/play/lobbyTyping";
import { SIDES, ROLES } from "../match/matchSharedDependencies/sharedTypes";



class LobbyService {
    init(myID: number, lobby: TLobby) {
        this._lobby = lobby;
        this._myID = myID;
    }

    destroy() {
        this._lobby = null;
        this._myID = null;
    }

    async return(lobby: TLobby) {
        matchService.destroy();

        this._lobby = lobby;
        await router.navigateTo("/lobby")
    }



    getSlots(): TSlots {        
        const mapSlots = getSlotsFromMap(this.lobby.matchSettings.map);
        const matchPlayers = this.getMatchPlayers()

        matchPlayers.forEach(player => {
            const team: keyof typeof SIDES = SIDES[player.team] as keyof typeof SIDES
            const role: keyof typeof ROLES = ROLES[player.role] as keyof typeof ROLES 

            if (mapSlots[team] === undefined || mapSlots[team][role] === undefined) {
                throw Error("Fuck everything about this bullshit")
            }
            if (player.userID === null || player.id === null || player.spriteID === null) {
                throw Error("Player should have been initialized by backend at this point!")
            }
            if (mapSlots[team][role] === null) {
                mapSlots[team][role] = {
                    id: player.id,
                    userID: player.userID,
                    nickname: player.nickname ? player.nickname : "null",
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

    updateReadinessIN() {
        lobbySocketService.send("updateReadiness", { ready: !this.amIReady() }); //We want to be the opposite of whatever we are atm
    }

    addFriendlyPlayerIN(player: TFriendlyPlayer) {
        lobbySocketService.send("addFriendlyPlayer", { player: player });
    }

    removeFriendlyPlayerIN(playerID: number) {
        lobbySocketService.send("removeFriendlyPlayer", { playerID: playerID });
    }

    addRankedPlayerIN(player: TRankedPlayer) {
        lobbySocketService.send("addRankedPlayer", { player: player })
    }

    removeRankedPlayerIN(playerID: number) {
        lobbySocketService.send("removeRankedPlayer", null)
    }

    addTournamentPlayerIN() {
        //This request does not need any payload because every info is either taken from auth or has default values
        //Must add a TTournPlayer to the participating list. See the type definition for details
        lobbySocketService.send("addTournamentPlayer", null);
    }
    removeTournamentPlayerIN() {
        lobbySocketService.send("removeTournamentPlayer", null);
    }

    inviteUserToLobby(userID: number) {
        lobbySocketService.send("inviteUserToLobby", { userID: userID });
    }

    leave() {
        lobbySocketService.disconnect();
        this.destroy();
    }

    startMatchIN() {
        lobbySocketService.send("start", null);
    }


    //outbound
    updateSettingsOUT(settings: TDynamicLobbySettings, updatedUsers: TLobbyUser[] | null) {
        this.lobby.matchSettings.map = settings.map
        this.lobby.matchSettings.mode = settings.mode
        this.lobby.matchSettings.duration = settings.duration
        LobbyPage.renderer?.renderSettings(
            this.lobby.type,
            this.lobby.matchSettings,
            this.amIHost()
        )
        if (updatedUsers && this.lobby.type !== "tournament") {
            this.lobby.users = updatedUsers
            LobbyPage.renderer?.renderPlayers()
            LobbyPage.renderer?.updateReadyButton(false)
        }
    }
    updateReadinessOUT(id: number, ready: boolean) {
        const user = this._findUserByID(id);
        user.ready = ready;
        if (this.myID === id) {
            LobbyPage.renderer?.updateReadyButton(ready);
        }
    }
    async addLobbyUserOUT(user: TLobbyUser) {
        this.lobby.users.push(user);
    }
    removeLobbyUserOUT(id: number) {
        const user = this._findUserByID(id);
        const index = this.lobby.users.indexOf(user);
        this.lobby.users.splice(index, 1);
    }
    addFriendlyPlayerOUT(userID: number, player: TFriendlyPlayer) {
        if (!this._isLobbyOfType("friendly")) { return; }
        const user = this._findUserByID(userID);
        if (user.id === this.myID) {
            console.log(`Player with id ${player.id} was added`)
            matchService.updateLatestControlsID(player.id)
        }
        if (user.player === null) {
            user.player = [player]
        } else {
            (user.player as TFriendlyPlayer[]).push(player)
        }
        LobbyPage.renderer?.updatePlayers();
    }
    removeFriendlyPlayerOUT(playerID: number) {
        if (!this._isLobbyOfType("friendly")) { return; }

        for (let i = 0; i < this.lobby.users.length; i++) {
            const user = this.lobby.users[i];
            const players: TFriendlyPlayer[] = (user.player) as TFriendlyPlayer[];
            if (!players) {continue} 
            const player = players.find(player => player.id === playerID);
            if (player) {
                const index: number = players.indexOf(player);
                players.splice(index, 1);
                if (players.length === 0) {
                    user.player = null;
                }
                if (user.id === this.myID) {
                    matchService.removeControls(playerID);
                }
                LobbyPage.renderer?.updatePlayers();
                return ;
            }
        }
        throw Error("The player requested was not found!");
    }
    addRankedPlayerOUT(userID: number, player: TRankedPlayer) {
        if (!this._isLobbyOfType("ranked")) { return; }

        const user = this._findUserByID(userID);
        user.player = player;
        LobbyPage.renderer?.updatePlayers();
    }
    removeRankedPlayerOUT(userID: number) {
        if (!this._isLobbyOfType("ranked")) { return; }
        const user = this._findUserByID(userID);
        user.player = null
        LobbyPage.renderer?.updatePlayers();
    }
    addTournamentPlayerOUT(userID: number) {
        if (!this._isLobbyOfType("tournament")) { return; }
        const user = this._findUserByID(userID);
        user.player = {};
        LobbyPage.renderer?.updatePlayers();
    }
    removeTournamentPlayerOUT(userID: number) {
        if (!this._isLobbyOfType("tournament")) { return; }
        const user = this._findUserByID(userID);
        user.player = null
        LobbyPage.renderer?.updatePlayers();
    }

    //errors
    handleActionBlock(blockType: string) { //probably this should be strongly typed, but I am way too tired
        switch (blockType) {
            case "notEveryoneReady":
                if (this.amIHost()) {
                    LobbyPage.renderer?.handleNotEveryoneReady();
                }
                break;
            case "fewPlayersForTournament":
                if (this.amIHost()) {
                    LobbyPage.renderer?.handleFewPlayersForTournament();
                }
                break;
            case "notAllSlotsFilled":
                if (this.amIHost()) {
                    LobbyPage.renderer?.handleNotAllSlotsFilled();
                }
                break;
            case "setReadyWithoutJoining": {
                LobbyPage.renderer?.handleSetReadyWithoutJoining();
                break;
            }
            default:
                throw Error(`${blockType} is not recognized! `)
        }
    }

    getMatchPlayers(): TMatchPlayer[] {
        const out: TMatchPlayer[] = []

        if (this._isLobbyOfType("friendly")) {
            this.lobby.users.forEach(user => {
                if (this.isUserParticipating(user.id)) {
                    const players = user.player as TFriendlyPlayer[]
                    if (players) {
                        players.forEach(player => {
                            out.push({
                                userID: user.id,
                                id: player.id,
                                nickname: player.nickname,
                                spriteID: player.spriteID,
                                team: player.team,
                                role: player.role,
                            })
                        })
                    }
                }
            })
        } else if (this._isLobbyOfType("ranked")) {
            this.lobby.users.forEach(user => {
                if (this.isUserParticipating(user.id)) {
                    const player = user.player as TRankedPlayer;
                    out.push({
                        userID: user.id,
                        id: user.id,
                        nickname: user.username,
                        spriteID: user.spriteID,
                        team: player.team,
                        role: player.role,
                    })
                }
            })
        } else { throw Error("Function called in wrong lobby type")}
        return out;
    }
    getTournPlayers(): TTournamentParticipant[] { //Probably this will only be used for pairings, and the tournament Service does not need all this info, so doublecheck constitution of TTournPlayers (also name lol)
        if (!this._isLobbyOfType("tournament")) {throw Error("Function called in wrong lobby type")}

        const out: TTournamentParticipant[] = [];
        this.lobby.users.forEach(user => {
            if (user.player) {
                const player = user.player as TTournamentPlayer;
                out.push({
                    id: user.id,
                    nick: user.username,
                    score: 0, //player.score,
                    rating: user.rating,
                    prevOpponents: [], //player.prevOpponents,
                    teamDist: 0, //player.teamPref,
                    participating: true
                })
            }
        })
        return out
    }

    amIHost(): boolean {
        return this.myID == this.lobby.hostID
    }
    amIReady(): boolean {
        const me = this.lobby.users.find(user => user.id == this.myID);
        if (!me) {throw Error("How can't I be in the lobby???"); }
        return me.ready
    }
 
    isUserParticipating(userID: number): boolean {
        const me = this.lobby.users.find(user => user.id == userID);
        if (!me) {throw Error("How can't I be in the lobby???"); }
        if (!me.player) {
            return false
        } else {
            return true
        }
    }

    private _lobby: TLobby | null = null;
    get lobby(): TLobby {
        if (!this._lobby) { throw Error("Settings are trying to be accessed when lobby hasn't been initialized yet!"); }
        return this._lobby;
    }
    private _myID: number | null = null;
    get myID(): number {
        if (this._myID === null) { throw Error("myID is not initialized!"); }
        return this._myID;
    }

    _findUserByID(userID: number): TLobbyUser {
        const user = this.lobby.users.find(user => user.id === userID);
        if (!user) { throw Error(`User with ID ${userID} was not found in lobby!`); }
        return user
    }
    _isLobbyOfType(desiredType: TLobbyType) {
        if (this.lobby.type !== desiredType) {
            return false;
        }
        return true
    }
}

export const lobbyService = new LobbyService();