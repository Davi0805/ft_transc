import { ROLES, SIDES } from "../../../match/matchSharedDependencies/sharedTypes";
import { lobbyService } from "../../../services/LobbyService";
import { TPlayerInSlot } from "../utils/helpers";
import { ALobbyRenderer } from "./ALobbyRenderer";

export abstract class AMatchLobbyRenderer extends ALobbyRenderer {
    constructor() { super() }

    async renderPlayers(): Promise<void> {
        const slots = lobbyService.getSlots();

        const teamsElement = document.getElementById('players') as HTMLElement;
        teamsElement.innerHTML = "";
        const slotsTable = document.createElement('table');

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

                const slotSpaceElement = document.createElement("td");
                slotSpaceElement.className = "text-center"
                if (player != null) {
                    this._renderOccupiedSlot(slotSpaceElement, player);
                } else if (this._canUserJoin()) {
                    this._renderJoinButton(slotSpaceElement, teamName, roleName);
                }

                slotElement.appendChild(slotSpaceElement);
                slotsTable.appendChild(slotElement);
            }
        }
        teamsElement.appendChild(slotsTable);
    }

    private _renderTeamName(slotsTable: HTMLTableElement, teamName: string) {
        const teamElement = document.createElement("tr");
        const teamNameElement = document.createElement("td");
        teamNameElement.className = "bg-gray-900/75 text-2xl"
        teamNameElement.colSpan = 2;
        teamNameElement.textContent = teamName;
        teamElement.appendChild(teamNameElement);
        slotsTable.appendChild(teamElement);
    }

    private _renderRoleName(slotElement: HTMLTableRowElement, roleName: string) {
        const roleNameElement = document.createElement("td");
        roleNameElement.className = "text-xl p-2 bg-gray-900/50 w-0"
        roleNameElement.textContent = roleName;
        slotElement.appendChild(roleNameElement)
    }

    private _renderOccupiedSlot(slotSpaceElement: HTMLTableCellElement, player: TPlayerInSlot) {
        console.log("The player in this slot is: ", player)
        const playerDiv = document.createElement("div");
        playerDiv.className = "flex flex-row"
        
        const playerElement = document.createElement("p");
        playerElement.className = "w-full text-xl p-2"
        playerElement.textContent = player.nickname.toString();
        playerDiv.appendChild(playerElement);
        if (player.userID === lobbyService.myID) {
            this._renderWithdrawButton(playerDiv, player);
        }
        slotSpaceElement.appendChild(playerDiv)
    }



    protected abstract _canUserJoin(): boolean;
    protected abstract _renderJoinButton(
        slotSpaceElement: HTMLTableCellElement,
        teamName: (keyof typeof SIDES),
        roleName: (keyof typeof ROLES)
    ): void;
    protected abstract _renderWithdrawButton(playerDiv: HTMLDivElement, player: TPlayerInSlot): void;
}