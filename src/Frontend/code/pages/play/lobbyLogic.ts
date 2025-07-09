import { lobbySocketService } from "../../services/lobbySocketService";
import { updateLobby } from "../../api/lobbyMatchAPI/updateLobbyAPI";
import { TLobby, TMapType, TMatchDuration, TMatchMode, TTournPlayer } from "./lobbyTyping";
import { getLobbySettingsByID } from "../../api/lobbyMatchAPI/getLobbySettingsAPI";
import { TournamentService} from "../../services/TournamentService";
import { TUserCustoms } from "../../../../../TempIsolatedMatchLogic/src/misc/types"
import { lobby } from "../../services/LobbyService";

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
        const map = (document.getElementById('match-map') as HTMLSelectElement).value;
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

    startLogic: async () => {
        if (!lobbySocketService.lobbyID) {
            throw Error("How can I start a game without a lobby?")
        }
        const settings = await getLobbySettingsByID(lobbySocketService.lobbyID);
        if (lobby.staticSettings?.type == "tournament") {
            LobbyLogic.prepareNextRound(settings);
        } else {
            const players = await lobby.getSlots();
            LobbyLogic.buildUserCustoms(settings, players);
        }
    },

    fetchAndAddPlayerToSlot: async (settingsDialog: HTMLDialogElement,
            team: string, role: string): Promise<void> => {
        const form = settingsDialog.querySelector("form") as HTMLFormElement;
        if (!form.reportValidity()) return;
        const aliasInput = document.getElementById("player-alias") as HTMLInputElement;
        const alias = aliasInput.value;
        const paddleIdInput = document.getElementById("player-paddle") as HTMLInputElement;
        const paddleId = paddleIdInput.value
        await lobby.addPlayerToSlot();
        console.log(`Player saved with alias ${alias} and paddle id ${paddleId}`)
        console.log(`Player added to team ${team} and role ${role}!`)
    },


    prepareNextRound: async (settings: TLobby) => {
        //const participants = await LobbyLogic.getParticipants();
        //const pairings = TournamentService.getNextRoundPairings(participants);
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