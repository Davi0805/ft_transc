import { lobbySocketService } from "../../services/lobbySocketService";
import { updateLobby } from "../../api/lobbyMatchAPI/updateLobbyAPI";
import { TMapType, TMatchMode, TMatchDuration, TLobbyType, getLobbySettingsByID, TLobby } from "../../api/lobbyMatchAPI/getLobbySettingsAPI";
import { TournamentService, TournPlayer } from "../../services/TournamentService";
import { TUserCustoms } from "../../../../../TempIsolatedMatchLogic/src/misc/types"

export type TTeam = {
    front?: TPlayerInSlot | null,
    back?: TPlayerInSlot | null
}

export type TSlots = {
    LEFT?: TTeam,
    RIGHT?: TTeam,
    TOP?: TTeam,
    BOTTOM?: TTeam
}

type TPlayerInSlot = {
    id: number,
    paddleID: number,
    spriteID: number
}

export const LobbyLogic = {
    //Settings logic
    fetchAndSubmitSettings: async () => {
        if (!lobbySocketService.lobbyID) {
            throw Error("How the fuck did I get to this lobby without opening the socket??")
        }
        const map = (document.getElementById('match-map') as HTMLSelectElement).value as TMapType;
        const mode = (document.getElementById('match-mode') as HTMLSelectElement).value;
        const duration = (document.getElementById('match-duration') as HTMLSelectElement).value;
        await updateLobby(lobbySocketService.lobbyID, {
            map: map as TMapType,
            mode: mode as TMatchMode,
            duration: duration as TMatchDuration
        })
        console.log("New settings applied!")
    },


    //Interactivity logic
    inviteUserToLobby: async () => {
        //TODO: Invite player to lobby
        console.log("Invite button was clicked")
    },

    leaveLobby: async () => {
        //TODO: tell db that player is not participating anymore!
        //TODO: ADD COMM TO DB THAT PLAYER LEFT
        console.log("Leave button was clicked")
    },

    isPlayerHost: async (): Promise<boolean> => {
        //TODO: Ask if player is host
        return true
    },

    isPlayerParticipating: async (): Promise<boolean> => {
        //TODO: ask backend if player is participating
        return false
    },

    isEveryoneReady: async (): Promise<boolean> => {
        //TODO: ask backend if everyone is ready
        return false
    },

    updatePlayerReadiness: async (ready: boolean) => {
        //TODO: update backend of player readiness
    },

    startLogic: async () => {
        if (!lobbySocketService.lobbyID) {
            throw Error("How can I start a game without a lobby?")
        }
        const settings = await getLobbySettingsByID(lobbySocketService.lobbyID);
        if (lobbySocketService.lobbyType == "tournament") {
            LobbyLogic.prepareNextRound(settings);
        } else {
            const players = await LobbyLogic.getSlots();
            LobbyLogic.buildUserCustoms(settings, players);
        }
    },


    //Slots logic
    getSlots: async (): Promise<TSlots> => {
        //TODO: get slots from backend
        
        
        
        
        //IMPORTANT TODO:
        //Might be easier to save as a list of players wit the slots as members??
        //That would make it easier as well to build user customs!!
        
        
        
        
        
        return {
            LEFT: {
                back: {
                    id: 123,
                    paddleID: 0,
                    spriteID: 0
                }
            },
            RIGHT: {
                front: null,
                back: {
                    id: 125,
                    paddleID: 2,
                    spriteID: 0
                }
            },
            TOP: {
                front: null,
            },
            BOTTOM: {
                front: {
                    id: 126,
                    paddleID: 3,
                    spriteID: 0
                },
                back: null
            },
        }
    },

    //TODO: IMPORTANT, DECIDE WHAT IS THE USER SETTINGS THAT MUST BE ADDED!!
    addPlayerToSlot: async (): Promise<void> => {
        //TODO: add player to slot
    },

    fetchAndAddPlayerToSlot: async (settingsDialog: HTMLDialogElement,
            team: string, role: string): Promise<void> => {
        const form = settingsDialog.querySelector("form") as HTMLFormElement;
        if (!form.reportValidity()) return;
        const aliasInput = document.getElementById("player-alias") as HTMLInputElement;
        const alias = aliasInput.value;
        const paddleIdInput = document.getElementById("player-paddle") as HTMLInputElement;
        const paddleId = paddleIdInput.value
        await LobbyLogic.addPlayerToSlot();
        console.log(`Player saved with alias ${alias} and paddle id ${paddleId}`)
        console.log(`Player added to team ${team} and role ${role}!`)
    },


    //TournamentLogic
    getParticipants: async (): Promise<TournPlayer[]> => {
        return [
            {
                id: 1,
                nick: "artuda-s",
                score: 3,
                rating: 1800,
                prevOpponents: [],
                teamDist: 0
            },
            {
                id: 2,
                nick: "dmelo-ca",
                score: 1,
                rating: 1600,
                prevOpponents: [],
                teamDist: 0
            },
            {
                id: 3,
                nick: "ndo-vale",
                score: 0,
                rating: 1700,
                prevOpponents: [],
                teamDist: 0
            }
        ] //TODO: GET THIS FROM DB. Make this go through the tournament service to get classification!!
    },

    getCurrentRound: async (): Promise<number> => {
        return 1 //TODO: get current round from backend
    },



    prepareNextRoundNumber: async (settings: TLobby) => {
        const participants = await LobbyLogic.getParticipants();
        const pairings = TournamentService.getNextRoundPairings(participants);
        //TODO: start all games with the pairings
    },

    buildUserCustoms: (settings: TLobby, players: TSlots): TUserCustoms => {
        const userCustoms: TUserCustoms = {
            field: {
                size: { x: 800, y: 400 }, //TODO: GET THIS FROM MAP IN SETTINGS
                backgroundSpriteID: 0 //TODO: Generate randomly
            },
            matchLength: 200, //TODO: GET FROM SETTINGS
            paddles: [],
            clients: [],
            bots: []
        }

        

        return userCustoms
    }

}