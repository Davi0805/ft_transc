import { ROLES, SIDES } from "../../../match/matchSharedDependencies/sharedTypes";
import { joinFriendlyClicked, withdrawFriendlyClicked } from "../buttonCallbacks";
import { getDirectionsFromTeam, TPlayerInSlot } from "../utils/helpers";
import { getButton, setupKeyCaptureButton } from "../utils/stylingComponents";
import { AMatchLobbyRenderer } from "./AMatchLobbyRenderer";

export class FriendlyLobbyRenderer extends AMatchLobbyRenderer {
    constructor() {
        super()
    }

    protected _canUserJoin(): boolean {
        return true;
    }

    protected _renderJoinButton(
        slotSpaceElement: HTMLTableCellElement,
        teamName: (keyof typeof SIDES),
        roleName: (keyof typeof ROLES)
    ): void {
        const slotJoinElement = getButton(`join-${teamName}-${roleName}`, "button", "Join", false);
        slotJoinElement.addEventListener('click', async () => this.renderCustomizePlayerWindow(SIDES[teamName], ROLES[roleName]))
        slotSpaceElement.appendChild(slotJoinElement);
    }

    protected _renderWithdrawButton(playerDiv: HTMLDivElement, player: TPlayerInSlot): void {
        const withdrawButton = getButton("btn-withdraw", "button", "X", false);
        withdrawButton.addEventListener("click", () => withdrawFriendlyClicked(player.id))
        playerDiv.appendChild(withdrawButton);
    }

    renderCustomizePlayerWindow(team: SIDES, role: ROLES) {
        const directions = getDirectionsFromTeam(team);
        
        const leftKey = "Arrow" + directions.left
        const rightKey = "Arrow" + directions.right

        const settingsDialog = document.createElement('dialog');
        settingsDialog.className = "fixed m-auto overflow-hidden rounded-lg"
        settingsDialog.innerHTML = `
            <form id="player-settings" method="dialog" class="flex flex-col items-center justify-center bg-gray-900/75 border-2 border-black/40 shadow-sm text-white rounded-lg gap-3 p-3 overflow-hidden">
                <h2>Configure player</h2>
                <div id="choose-alias" class="flex flex-row gap-3">
                    <label for="player-alias" class="text-xl">Alias:</label>
                    <input id="player-alias" name="player-alias" class="bg-gray-900/50 rounded-2xl px-4 text-center" required></input>
                </div>
                <div id="choose-paddle" class="flex flex-row gap-3">
                    <label for="player-paddle" class="text-xl">Paddle:</label>
                    <select id="player-paddle" name="player-paddle" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                    </select>
                </div>
                <div id="choose-left-ctr" class="flex flex-row gap-3">
                    <input type="hidden" id="left-key" name="left-key" value="${leftKey}">
                    <label for="left-listener" class="text-xl">${directions.left} button:</label>
                    ${getButton("left-listener", "button", leftKey, false).outerHTML}
                </div>
                <div id="choose-right-ctr" class="flex flex-row gap-3">
                    <input type="hidden" id="right-key" name="right-key" value="${rightKey}">
                    <label for="right-listener" class="text-xl">${directions.right} button:</label>
                    ${getButton("right-listener", "button", rightKey, false).outerHTML}
                </div>

                ${getButton("btn-close-dialog", "submit", "Join", false).outerHTML}
            </form>
        `;
        document.body.appendChild(settingsDialog);

        
        const leftListener = document.getElementById("left-listener") as HTMLButtonElement
        const rightListener = document.getElementById("right-listener") as HTMLButtonElement
        const leftInput = document.getElementById("left-key") as HTMLInputElement
        const rightInput = document.getElementById("right-key") as HTMLInputElement

        setupKeyCaptureButton(leftListener, leftInput)
        setupKeyCaptureButton(rightListener, rightInput)

        const playerSettingsForm = document.getElementById("player-settings") as HTMLElement;
        playerSettingsForm.addEventListener("submit", (e: SubmitEvent) => {
            joinFriendlyClicked(e, team, role);
            settingsDialog.close();
            settingsDialog.remove();
        })
        settingsDialog.showModal();
    }

    protected readonly subtitleText: string = "Friendly Match Lobby";
}
