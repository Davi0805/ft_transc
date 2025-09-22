import type { FriendlyPlayerT, LobbyCreationConfigsT, LobbyTypeT, LobbyUserT, RankedPlayerT, TournamentPlayerT } from "../Factories/LobbyFactory.js";
import type { MatchMapT, MatchSettingsT } from "../Factories/MatchFactory.js";

import lobbyFactory from "../Factories/LobbyFactory.js";
import lobbyRepository from "../../Adapters/Outbound/LobbyRepository.js";
import socketService from "./SocketService.js";
import friendlyService from "./FriendlyService.js";
import rankedService from "./RankedService.js";
import tournamentService from "./TournamentService.js";
import matchService from "./MatchService.js";
import matchRepository from "../../Adapters/Outbound/MatchRepository.js";

//When a client wants to see the list of lobbies available, receives an array of these
export type LobbyForDisplayT = {
    id: number,
    name: string,
    host: string,
    type: LobbyTypeT
    capacity: { taken: number, max: number }
}


class LobbyService {
    isUserInAnotherMatch(lobbyID: number, userID: number) {
        const matchInfo = matchService.getMatchInfoByUserID(userID);
        return matchInfo && matchInfo.lobbyID != lobbyID;
    }

    isLobbyWithActiveEvent(lobbyID: number) {
        const matchInfos = matchService.getMatchInfosByLobbyID(lobbyID);
        return (matchInfos && matchInfos.length !== 0) ? true : false;
    }

    isUserInActiveLobbyEvent(lobbyID: number, userID: number): boolean {
        const matchInfos = matchService.getMatchInfosByLobbyID(lobbyID);        
        if (matchInfos && matchInfos.length !== 0) {
            return matchInfos.find(matchInfo => matchInfo.userIDs.includes(userID)) ? true : false;
        }

        const tournamentInfo = tournamentService.getCurrentInfoByLobbyID(lobbyID);
        if (tournamentInfo) {
            return tournamentInfo.participants.find(player => player.id === userID && player.participating) ? true : false
        }

        return false;
    }

    getLobbiesForDisplay(): LobbyForDisplayT[] {
        const lobbies = lobbyRepository.getAll();

        //TODO: Maybe I should make a mapper for this
        return lobbies.map(lobby => {
            return {
                id: lobby.id,
                name: lobby.name,
                host: lobby.users.find(u => u.id == lobby.hostID)?.username ?? "",
                type: lobby.type,
                capacity: {
                    taken: this._getParticipantsAm(lobby.users),
                    max: lobby.type === "tournament"
                        ? tournamentService.MAX_PARTICIPANTS
                        : this._getMaxPlayersFromMap(lobby.matchSettings.map)
                }, 
            }
        })
    }

    getLobbyByID(lobbyID: number) {
        return lobbyRepository.getByID(lobbyID);
    }

    getLobbyInfoForClient(lobbyID: number, userID: number) {
        const lobby = lobbyService.getLobbyByID(lobbyID);
        const matchConfigs = matchService.getMatchClientConfigsByUserID(userID);
        if (matchConfigs) {
            const match = matchService.getMatchByUserID(userID);
            if (!match) {throw Error("Match configs exist but no match??")}
            matchConfigs.gameSceneConfigs.gameInitialState.balls = match.getBallsFullState()
        }
        const tournamentConfigs = tournamentService.getCurrentInfoByLobbyID(lobbyID);
        return {
            lobby: lobby,
            matchConfigs: matchConfigs,
            tournamentConfigs: tournamentConfigs
        }
    }

    createLobby(lobbyCreationConfigs: LobbyCreationConfigsT, hostID: number) {
        const newLobby = lobbyFactory.createLobby(lobbyCreationConfigs, hostID);
        lobbyRepository.add(newLobby);
        return newLobby.id;
    }

    addUser(lobbyID: number, userID: number, username: string, spriteID: number, rating: number) {
        const lobby = lobbyRepository.getByID(lobbyID);
        const user = {
            id: userID,
            username: username,
            spriteID: spriteID,
            rating: rating,
            ready: false,
            player: null
        }
        //Broadcast before adding, so the user that just arrived does NOT get the message
        //This user will receive the entire lobby info instead, which already includes him/her
        socketService.broadcastToLobby(lobbyID, "addLobbyUser", { user: user })
        lobby.users.push(user);
    }

    removeUser(lobbyID: number, userID: number) {
        const lobby = lobbyRepository.getByID(lobbyID);
        lobby.users = lobby.users.filter(user => user.id !== userID);
        socketService.broadcastToLobby(lobbyID, "removeLobbyUser", { userID: userID })
        //Automatically close lobby if nobody is in there and no match is active
        if (lobby.users.length === 0 && matchRepository.getInfosByLobbyID(lobbyID)?.length !== 0) {
            lobbyRepository.remove(lobbyID);
        }
    }

    updateSettings(lobbyID: number, senderID: number, newSettings: MatchSettingsT) {
        const lobby = lobbyRepository.getByID(lobbyID);
        if (lobby.hostID !== senderID) {
            console.log("Somehow a non host managed to send a settings change request! It will be ignored.");
            return;
        }

        //It should remove all users from slots in case the map change messes up with which slots are available!
        const updateUsers = lobby.matchSettings.map !== newSettings.map && lobby.type !== "tournament"
        lobby.matchSettings = newSettings;

        let users: LobbyUserT[] | null = null;
        if (updateUsers) {
            lobby.users.forEach(user => {
                user.player = null;
                user.ready = false
            })
            users = lobby.users;
        }

        socketService.broadcastToLobby(lobbyID, "updateSettings", {
            settings: newSettings,
            users: users
        })
        //No need to broadcast readiness change, as the users themselves will be rewritten by the dto sent in updateSettings, which includes ready:false for all
    }

    updateUserReadinesss(lobbyID: number, userID: number, ready: boolean) {
        const user = this._getLobbyUserByID(lobbyID, userID);
        if (!user.player) {
            socketService.broadcastToUsers([userID], "actionBlock", { reason: "setReadyWithoutJoining" })
            return;
        }
        user.ready = ready

        //Currently, broadcasting to all users is actually not necessary, as the frontend does not need to know which users are ready.
        //It is working though, so I will leave it here, because if we want to show that info eventually, it is already set up
        socketService.broadcastToLobby(lobbyID, "updateReadiness", {
            userID: userID,
            ready: ready
        })
    }

    addFriendlyPlayer(lobbyID: number, userID: number, player: FriendlyPlayerT) {
        const user = this._getLobbyUserByID(lobbyID, userID);
        //id comes as -1, because is only setting that must be generated by backend
        player.id = this._currentID++;
        //This distinction is important to make because, for unification purposes, if a user is not participating, player is null and not an empty array
        if (!user.player) {
            user.player = [player]
        } else {
            (user.player as FriendlyPlayerT[]).push(player)
        }

        socketService.broadcastToLobby(lobbyID, "addFriendlyPlayer", {
            userID: userID,
            player: player
        })
    }

    removeFriendlyPlayer(lobbyID: number, userID: number, playerID: number) {
        const user = this._getLobbyUserByID(lobbyID, userID);
        user.player = (user.player as FriendlyPlayerT[]).filter(player => player.id !== playerID)
        if ((user.player as FriendlyPlayerT[]).length === 0) { user.player = null}

        socketService.broadcastToLobby(lobbyID, "removeFriendlyPlayer", {
            playerID: playerID
        })

        //For all removes, the user must become not ready
        user.ready = false;
        socketService.broadcastToLobby(lobbyID, "updateReadiness", {
            userID: userID,
            ready: false
        })
    }

    addRankedPlayer(lobbyID: number, userID: number, player: RankedPlayerT) {
        const user = this._getLobbyUserByID(lobbyID, userID);
        user.player = player;

        socketService.broadcastToLobby(lobbyID, "addRankedPlayer", {
            userID: userID,
            player: player
        })
    }

    removeRankedPlayer(lobbyID: number, userID: number) {
        const user = this._getLobbyUserByID(lobbyID, userID);
        user.player = null;
        socketService.broadcastToLobby(lobbyID, "removeRankedPlayer", {
            userID: userID
        })

        user.ready = false;
        socketService.broadcastToLobby(lobbyID, "updateReadiness", {
            userID: userID,
            ready: false
        })
    }

    addTournamentPlayer(lobbyID: number, userID: number) {
        const lobby = lobbyRepository.getByID(lobbyID);
        const participantsAmount = lobby.users.filter(user => user.player != null).length;

        if (participantsAmount < tournamentService.MAX_PARTICIPANTS) {
            const user = this._getLobbyUserByID(lobbyID, userID);
            user.player = {} as TournamentPlayerT
            socketService.broadcastToLobby(lobbyID, "addTournamentPlayer", {
                userID: userID,
            })
        } else {
            socketService.broadcastToUsers([userID], "actionBlock", { reason: "tooManyPlayersInTournament" })
        }
        
    }

    removeTournamentPlayer(lobbyID: number, userID: number) {
        const user = this._getLobbyUserByID(lobbyID, userID);
        
        user.player = null;
        socketService.broadcastToLobby(lobbyID, "removeTournamentPlayer", {
            userID: userID
        })

        user.ready = false;
        socketService.broadcastToLobby(lobbyID, "updateReadiness", {
            userID: userID,
            ready: false
        })
    }

    start(lobbyID: number, senderID: number) {
        const lobby = lobbyRepository.getByID(lobbyID);
        if (lobby.hostID != senderID) {
            console.log(`Somehow userID ${senderID} is not host and tried to start the game! The host id is ${lobby.hostID}`)
            return ;
        }

        if (!this._isEveryoneReady(lobby.users)) {
            socketService.broadcastToUsers([senderID], "actionBlock", { reason: "notEveryoneReady" })
            return;
        }

        //Lobby's job is done. Delegate work to the corresponding service
        switch (lobby.type) {
            case "friendly":
                friendlyService.start(lobby, senderID);
                break;
            case "ranked":
                rankedService.start(lobby, senderID);
                break;
            case "tournament":
                tournamentService.start(lobby, senderID);
                break;
            default:
                throw Error("lobby type not recognized!");
        }
    }

    returnToLobby(lobbyID: number) {
        const lobby = lobbyRepository.getByID(lobbyID);
        if (lobby.users.length === 0) {
            lobbyRepository.remove(lobbyID);
        } else {
            lobby.users.forEach(user => {
                user.player = null;
                user.ready = false;
            })
            socketService.broadcastToLobby(lobbyID, "returnToLobby", { lobby: lobby })
        }
    }

    private _currentID: number = 0; //Necessary to tag the friendly players

    private _getLobbyUserByID(lobbyID: number, userID: number) {
        const lobby = lobbyRepository.getByID(lobbyID);
        const user = lobby.users.find(user => user.id === userID);
        if (!user) {throw Error("User could not be found in lobby!")};
        return user;
    }

    private _isEveryoneReady(lobbyUsers: LobbyUserT[]): boolean {
        return lobbyUsers.find(user => (user.player && !user.ready)) ? false : true
    }

    private _getParticipantsAm(users: LobbyUserT[]): number {
        const participants = users.filter(user => user.player !== null);
        return participants.length
    }

    private _getMaxPlayersFromMap(map: MatchMapT): number {
        const [amountStr, type, _size] = map.split("-");
        const amount = Number(amountStr);

        return (amount * (type === "teams" ? 2 : 1))
    }
}

const lobbyService = new LobbyService();
export default lobbyService;