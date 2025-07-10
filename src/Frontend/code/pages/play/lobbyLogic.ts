import { lobbySocketService } from "../../services/lobbySocketService";
import { updateLobby } from "../../api/lobbyMatchAPI/updateLobbyAPI";
import { TLobby, TMapType, TMatchDuration, TMatchMode, TMatchPlayer, TTournPlayer } from "./lobbyTyping";
import { TournamentService} from "../../services/TournamentService";
import { ROLES, SIDES, TUserCustoms } from "../../../../../TempIsolatedMatchLogic/src/misc/types"
import { lobby } from "../../services/LobbyService";
import { matchService } from "../../services/matchService";
import { router } from "../../routes/router";

export type TTeam = {
    -readonly [key in keyof typeof ROLES]?: TPlayerInSlot | null //The shittiest fucking language I have ever seen in my life
}

export type TSlots = {
    -readonly [key in keyof typeof SIDES]?: TTeam
}

type TPlayerInSlot = {
    id: number,
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

    fetchAndAddPlayerToSlot: async (settingsDialog: HTMLDialogElement,
            team: SIDES, role: ROLES): Promise<void> => {
        const form = settingsDialog.querySelector("form") as HTMLFormElement;
        if (!form.reportValidity()) return;
        const aliasInput = document.getElementById("player-alias") as HTMLInputElement;
        const alias = aliasInput.value;
        const paddleIdInput = document.getElementById("player-paddle") as HTMLInputElement;
        const paddleId = Number(paddleIdInput.value)
        await lobby.addMatchPlayer({
            userID: null,
            id: null,
            nick: alias,
            spriteID: paddleId,
            team: team,
            role: role,
            leftControl: "LeftArrow", //TODO: must add choice of controls to UI
            rightControl: "RightArrow"
        });
        console.log(`Player saved with alias ${alias} and paddle id ${paddleId}`)
        console.log(`Player added to team ${team} and role ${role}!`)
    },


    startLogic: async () => {
        if (!lobbySocketService.lobbyID) {
            throw Error("How can I start a game without a lobby?")
        }
        const settings = await lobby.getMySettings();
        if (lobby.staticSettings?.type == "tournament") {
            LobbyLogic.prepareNextRound(settings);
        } else {
            const players = await lobby.getMatchPlayers();
            const userCustoms = LobbyLogic.buildUserCustoms(settings, players);
            matchService.injectConfigs(userCustoms);
            router.navigateTo("/match");
        }
    },

    prepareNextRound: async (settings: TLobby) => {
        //const participants = await LobbyLogic.getParticipants();
        //const pairings = TournamentService.getNextRoundPairings(participants);
        //TODO: start all games with the pairings
    },

    buildUserCustoms: (settings: TLobby, players: TMatchPlayer[]): TUserCustoms => {
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

        const paddleID = 0;
        players.forEach(player => {
            if (!player.userID || !player.id || !player.spriteID) {
                throw Error("This player is not initialized!!");
            }

            userCustoms.paddles.push({
                id: paddleID,
                side: player.team,
                role: player.role,
                spriteID: player.spriteID
            })

            const human = {
                id: player.id,
                paddleID: paddleID,
                controls: {
                    left: player.leftControl,
                    right: player.rightControl,
                    pause: " " //TODO: Deprecated. To be removed
                }
            }
            const client = userCustoms.clients.find(client => client.id === player.userID);
            if (client) {
                client.humans.push(human);
            } else {
                userCustoms.clients.push({
                    id: player.userID,
                    humans: [human]
                })
            }
            
        })
        //TODO: Have to find a way to build bots into empty slots

        return userCustoms
    }

}