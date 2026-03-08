import { ROLES, SIDES } from "../../../match/matchSharedDependencies/sharedTypes";
import { lobbyService } from "../../../services/LobbyService";
import { TPlayerInSlot } from "../utils/helpers";
import { ALobbyRenderer } from "./ALobbyRenderer";

//Implements functions that are common to both friendly and ranked matches.
// still abstract as there are a few differences between the two and those are addressed by individual children renderes
export abstract class AMatchLobbyRenderer extends ALobbyRenderer {
    constructor() { super() }

    //Implements the parent function that renders the players participating in the game
    // in this case it is the slots and the players in them
    async renderPlayers(): Promise<void> {
        //Info from Service
        const slots = lobbyService.getSlots();
        const myID = lobbyService.myID;

        //The div element that will receive the players — it is a grid, each team is a card
        const teamsElement = document.getElementById('players') as HTMLDivElement;
        teamsElement.innerHTML = "";

        for (const teamName of (Object.keys(slots) as (keyof typeof SIDES)[])) {
            const team = slots[teamName];
            if (!team) continue;

            // Team card
            const teamCard = document.createElement('div');
            teamCard.className = "bg-black/20 rounded-xl p-5 border border-white/10 backdrop-blur-sm";

            const teamHeader = document.createElement('h3');
            teamHeader.className = "text-xl font-semibold mb-4 text-center uppercase tracking-wide";
            teamHeader.textContent = `${teamName} Team`;
            teamCard.appendChild(teamHeader);

            const slotsContainer = document.createElement('div');
            slotsContainer.className = "flex flex-col gap-3";

            for (const roleName of (Object.keys(team) as (keyof typeof ROLES)[])) {
                const player = team[roleName]
                if (player === undefined) { continue; }

                // Slot row
                const slotRow = document.createElement("div");
                slotRow.className = "flex justify-between items-center min-h-[52px] bg-black/30 px-4 py-3 rounded-lg border border-white/10";
                slotRow.id = `slot-${teamName}-${roleName}`;

                const roleLabel = document.createElement("span");
                roleLabel.className = "font-bold text-sm uppercase tracking-wide";
                roleLabel.textContent = roleName;
                slotRow.appendChild(roleLabel);

                const slotSpaceElement = document.createElement("div");
                slotSpaceElement.className = "min-w-0 overflow-hidden flex items-center";
                if (player != null) {
                    this._renderOccupiedSlot(slotSpaceElement, player, myID);
                } else if (this._canUserJoin()) {
                    this._renderJoinButton(slotSpaceElement, teamName, roleName);
                }

                slotRow.appendChild(slotSpaceElement);
                slotsContainer.appendChild(slotRow);
            }

            teamCard.appendChild(slotsContainer);
            teamsElement.appendChild(teamCard);
        }
    }

    async updatePlayers(): Promise<void> {
        this.renderPlayers()
    }

    //Renders the player information in that slot.
    // NOTE: If different info of the player is needed, TPlayerInSlot can be changed and getSlot() updated accordingly
    private _renderOccupiedSlot(slotSpaceElement: HTMLDivElement, player: TPlayerInSlot, myID: number) {
        const isMe = player.userID === myID;

        const playerDiv = document.createElement("div");
        playerDiv.className = "flex items-center gap-2 min-w-0";

        const playerName = document.createElement("span");
        if (isMe) {
            playerName.className = "font-bold text-sm text-emerald-400 truncate";
        } else {
            playerName.className = "font-medium text-sm text-sky-300 truncate";
        }
        playerName.textContent = player.nickname.toString();
        playerDiv.appendChild(playerName);

        //Render the button to leave slot in case the user owns the player in it
        if (isMe) {
            this._renderWithdrawButton(playerDiv, player);
        }
        slotSpaceElement.appendChild(playerDiv);
    }


    //These are the functions whose implementations depend on the type of match
    protected abstract _canUserJoin(): boolean;
    protected abstract _renderJoinButton(
        slotSpaceElement: HTMLDivElement,
        teamName: (keyof typeof SIDES),
        roleName: (keyof typeof ROLES)
    ): void;
    protected abstract _renderWithdrawButton(playerDiv: HTMLDivElement, player: TPlayerInSlot): void;
}