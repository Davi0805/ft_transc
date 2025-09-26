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

        //The div element that will receive the players
        const teamsElement = document.getElementById('players') as HTMLDivElement;
        teamsElement.innerHTML = "";
        //The table that will be inserted in that div
        const slotsTable = document.createElement('table');

        //Goes through all team names and all roles on each team name.
        // If they exist in the slots object, it means it is allowed by the map, so it should be rendered
        for (const teamName of (Object.keys(slots) as (keyof typeof SIDES)[])) {
            const team = slots[teamName];
            if (!team) continue;
            this._renderTeamName(slotsTable, teamName);

            for (const roleName of (Object.keys(team) as (keyof typeof ROLES)[])) {
                const player = team[roleName]
                if (player === undefined) { continue; }

                const slotElement = document.createElement("tr");
                slotElement.className = "border-b border-gray-900/50"
                this._renderRoleName(slotElement, roleName)

                //Everything above was the rendering of the team/role names.
                // The rendering of the actual slot is done below
                const slotSpaceElement = document.createElement("td");
                slotSpaceElement.className = "text-center"
                if (player != null) { //player exists in the slot, so the info of the player must be displayed
                    this._renderOccupiedSlot(slotSpaceElement, player, myID);
                } else if (this._canUserJoin()) { //User must be able to join for the join button to be rendered
                    this._renderJoinButton(slotSpaceElement, teamName, roleName);
                } //Currently, if a slot is empty but the user cannot join it for whatever reason, nothing is rendered.
                // If something is to be rendered, it would go on an else statement here

                slotElement.appendChild(slotSpaceElement);
                slotsTable.appendChild(slotElement);
            }
        }
        teamsElement.appendChild(slotsTable);
    }

    async updatePlayers(): Promise<void> {
        this.renderPlayers()
    }

    //This adds the team name to the table of players, so the slots can be inserted below it
    private _renderTeamName(slotsTable: HTMLTableElement, teamName: string) {
        const teamElement = document.createElement("tr");
        const teamNameElement = document.createElement("td");
        teamNameElement.className = "bg-gray-900/75 text-2xl"
        //The table always has two collumns: one for the role name and the other for the slot (empty or not)
        // The team name must span both of them
        teamNameElement.colSpan = 2;
        teamNameElement.textContent = teamName;
        teamElement.appendChild(teamNameElement);
        slotsTable.appendChild(teamElement);
    }

    //Adds the role name to the slot element
    private _renderRoleName(slotElement: HTMLTableRowElement, roleName: string) {
        const roleNameElement = document.createElement("td");
        roleNameElement.className = "text-xl p-2 bg-gray-900/50 w-0"
        roleNameElement.textContent = roleName;
        slotElement.appendChild(roleNameElement)
    }

    //Renders the player information in that slot.
    // NOTE: If diffenent info of the player is needed, TPlayerInSlot can be changed and getSlot() updated accordingly
    private _renderOccupiedSlot(slotSpaceElement: HTMLTableCellElement, player: TPlayerInSlot, myID: number) {
        const playerDiv = document.createElement("div");
        playerDiv.className = "flex flex-row"
        
        const playerElement = document.createElement("p");
        playerElement.className = "w-full text-xl p-2"
        playerElement.textContent = player.nickname.toString();
        playerDiv.appendChild(playerElement);
        //Render the button to leave slot in case the user owns the player in it
        if (player.userID === myID) {
            this._renderWithdrawButton(playerDiv, player);
        }
        slotSpaceElement.appendChild(playerDiv)
    }


    //These are the functions whose implementations depend on the type of match
    protected abstract _canUserJoin(): boolean;
    protected abstract _renderJoinButton(
        slotSpaceElement: HTMLTableCellElement,
        teamName: (keyof typeof SIDES),
        roleName: (keyof typeof ROLES)
    ): void;
    protected abstract _renderWithdrawButton(playerDiv: HTMLDivElement, player: TPlayerInSlot): void;
}