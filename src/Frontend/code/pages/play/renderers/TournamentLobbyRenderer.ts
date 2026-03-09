import { lobbyService } from "../../../services/LobbyService";
import { joinWithdrawTournamentClicked } from "../buttonCallbacks";
import { ALobbyRenderer } from "./ALobbyRenderer";

export class TournamentLobbyRenderer extends ALobbyRenderer {
    constructor() {
        super()
    }

    private readonly _baseBtn = "px-6 py-3.5 border-0 rounded-lg font-semibold text-base cursor-pointer transition-all uppercase tracking-wide text-white hover:-translate-y-0.5";

    async renderPlayers(): Promise<void> {
        const participantsElement = document.getElementById('players') as HTMLElement;

        // Switch from grid to flex-col so table and button are controlled independently
        participantsElement.className = "flex flex-col gap-3 flex-1 min-h-0 overflow-hidden";

        // Scrollable table container — grows to fill remaining space
        const participantsTableElement = document.createElement("div");
        participantsTableElement.id = "participants-table";
        participantsTableElement.className = "flex-1 min-h-0";
        participantsElement.appendChild(participantsTableElement);

        this._renderTournamentTable();

        // Join / Withdraw toggle button — centered, not full-width
        const btn = document.createElement('button');
        btn.id = "btn-join-withdraw";
        btn.type = "button";
        btn.dataset.joined = "false";
        btn.className = `mx-auto w-48 ${this._baseBtn} bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30`;
        btn.textContent = "Join";

        btn.addEventListener("click", () => {
            const joining = btn.dataset.joined !== "true";
            btn.dataset.joined = joining ? "true" : "false";
            if (joining) {
                btn.textContent = "Withdraw";
                btn.className = `mx-auto w-48 ${this._baseBtn} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/30`;
            } else {
                btn.textContent = "Join";
                btn.className = `mx-auto w-48 ${this._baseBtn} bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30`;
            }
            joinWithdrawTournamentClicked(joining);
        });

        // Place button as sibling of #players, not inside it
        participantsElement.insertAdjacentElement('afterend', btn);
    }

    async updatePlayers(): Promise<void> {
        // Only re-renders the table — the join/withdraw button keeps its state
        this._renderTournamentTable();
    }

    private _renderTournamentTable() {
        const participants = lobbyService.getTournPlayers();
        const myID = lobbyService.myID;

        const tableElement = document.getElementById("participants-table");
        if (!tableElement) { throw new Error("Tournament table element was not found"); }

        const headCell = "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/60 text-left";

        let bodyRows = "";
        let place = 1;
        for (const participant of participants) {
            const opacity = participant.participating ? "" : "opacity-25";
            const isMe = participant.id === myID;
            const rowBg = isMe ? "bg-emerald-900/20" : (place % 2 === 0 ? "bg-black/20" : "bg-black/30");
            const nameClass = isMe ? "font-bold text-emerald-400" : "font-medium text-sky-300";
            bodyRows += `
                <tr class="${rowBg} ${opacity} border-b border-white/5">
                    <td class="px-4 py-3 text-white/50 text-sm">${place++}</td>
                    <td class="px-4 py-3 text-sm ${nameClass}">${participant.nick ?? "—"}</td>
                    <td class="px-4 py-3 text-sm text-white/80">${participant.rating}</td>
                    <td class="px-4 py-3 text-sm text-white/80">${participant.score}</td>
                </tr>
            `;
        }

        tableElement.innerHTML = `
            <div class="h-full bg-black/20 rounded-xl border border-white/10 overflow-hidden flex flex-col">
                <div class="px-5 py-4 border-b border-white/10 flex-shrink-0">
                    <h2 class="text-xl font-semibold uppercase tracking-wide text-center">Participants</h2>
                </div>
                <div class="overflow-y-auto flex-1 min-h-0">
                    <table class="w-full border-collapse">
                        <thead class="sticky top-0 bg-blue-950">
                            <tr>
                                <th class="${headCell}">#</th>
                                <th class="${headCell}">Player</th>
                                <th class="${headCell}">Rating</th>
                                <th class="${headCell}">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bodyRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    protected readonly subtitleText: string = "Tournament Lobby";
}
