import { SIDES, ROLES } from "../../../match/matchSharedDependencies/sharedTypes";
import { lobbyService } from "../../../services/LobbyService"; //I tried, but I do not know how to get rid of this dependency
import { joinRankedClicked, withdrawRankedClicked } from "../buttonCallbacks";
import { TPlayerInSlot } from "../utils/helpers";
import { AMatchLobbyRenderer } from "./AMatchLobbyRenderer";

export class RankedLobbyRenderer extends AMatchLobbyRenderer {
    constructor() {
        super()
    }

    protected _canUserJoin(): boolean {
        return !lobbyService.isUserParticipating(lobbyService.myID)
    }

    protected _renderJoinButton(
        slotSpaceElement: HTMLDivElement,
        teamName: (keyof typeof SIDES),
        roleName: (keyof typeof ROLES)
    ): void {
        const slotJoinElement = document.createElement('button');
        slotJoinElement.id = `join-${teamName}-${roleName}`;
        slotJoinElement.type = "button";
        slotJoinElement.className = "bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-2 rounded-md text-white font-semibold cursor-pointer transition-all hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30";
        slotJoinElement.textContent = "Join";
        slotJoinElement.addEventListener('click', () => {
            document.querySelectorAll<HTMLButtonElement>('[id^="join-"]').forEach(b => b.disabled = true);
            joinRankedClicked(SIDES[teamName], ROLES[roleName]);
        });
        slotSpaceElement.appendChild(slotJoinElement);
    }

    protected _renderWithdrawButton(playerDiv: HTMLDivElement, player: TPlayerInSlot): void {
        const withdrawButton = document.createElement('button');
        withdrawButton.id = "btn-withdraw";
        withdrawButton.type = "button";
        withdrawButton.className = "bg-gradient-to-br from-red-500 to-red-600 px-3 py-1 rounded-md text-white font-semibold cursor-pointer transition-all hover:from-red-600 hover:to-red-700 text-xs";
        withdrawButton.textContent = "X";
        withdrawButton.addEventListener("click", () => withdrawRankedClicked(player.id));
        playerDiv.appendChild(withdrawButton);
    }

    protected readonly subtitleText: string = "Ranked Match Lobby";
}