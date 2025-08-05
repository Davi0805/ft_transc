import { SIDES, ROLES } from "../../../match/matchSharedDependencies/sharedTypes";
import { lobbyService } from "../../../services/LobbyService";
import { joinRankedClicked, withdrawRankedClicked } from "../buttonCallbacks";
import { TPlayerInSlot } from "../utils/helpers";
import { getButton } from "../utils/stylingComponents";
import { AMatchLobbyRenderer } from "./AMatchLobbyRenderer";

export class RankedLobbyRenderer extends AMatchLobbyRenderer {
    constructor() {
        super()
    }

    protected _canUserJoin(): boolean {
        return !(lobbyService.isUserParticipating(lobbyService.myID))
    }

    protected _renderJoinButton(
        slotSpaceElement: HTMLTableCellElement,
        teamName: (keyof typeof SIDES),
        roleName: (keyof typeof ROLES)
    ): void {
        const slotJoinElement = getButton(`join-${teamName}-${roleName}`, "button", "Join", false);
        slotJoinElement.addEventListener('click', async () => joinRankedClicked(SIDES[teamName], ROLES[roleName]))
        slotSpaceElement.appendChild(slotJoinElement);
    }

    protected _renderWithdrawButton(playerDiv: HTMLDivElement, player: TPlayerInSlot): void {
        const withdrawButton = getButton("btn-withdraw", "button", "X", false);
        withdrawButton.addEventListener("click", () => withdrawRankedClicked(player.id))
        playerDiv.appendChild(withdrawButton);
    }

    protected readonly subtitleText: string = "Ranked Match Lobby";
}