
import { lobbyService } from "../../services/LobbyService";
import { router } from "../../routes/router";
import { tournamentService } from "../../services/tournamentService";
import { quitTournamentClicked } from "./buttonCallbacks";

const _baseBtn = "px-6 py-3.5 border-0 rounded-lg font-semibold text-base cursor-pointer transition-all uppercase tracking-wide text-white hover:-translate-y-0.5";
const _headCell = "text-xs font-semibold uppercase tracking-wider text-white/60";

function _standingsTable(participants: typeof tournamentService.tournament.participants): string {
    let place = 1;
    let bodyHtml = "";
    participants.forEach(player => {
        const isMe = player.id === lobbyService.myID;
        const rowBg = isMe ? "bg-emerald-900/20" : (place % 2 === 0 ? "bg-black/20" : "bg-black/30");
        const idAttr = isMe ? `id="my-standing-row"` : "";
        const nameClass = isMe ? "font-bold text-emerald-400" : "font-medium text-sky-300";
        bodyHtml += `
            <tr ${idAttr} class="${rowBg} border-b border-white/5">
                <td class="px-4 py-3 text-white/50 text-sm">${place++}</td>
                <td class="px-4 py-3 text-sm ${nameClass}">${player.nick ?? "—"}</td>
                <td class="px-4 py-3 text-sm text-white/80">${player.rating}</td>
                <td class="px-4 py-3 text-sm text-white/80">${player.score}</td>
            </tr>
        `;
    });

    return `
        <div class="h-full overflow-y-auto rounded-xl bg-black/20 border border-white/10">
            <table class="w-full border-collapse">
                <thead class="sticky top-0 bg-blue-950">
                    <tr>
                        <th class="${_headCell} px-4 py-3 text-left w-8">#</th>
                        <th class="${_headCell} px-4 py-3 text-left">Player</th>
                        <th class="${_headCell} px-4 py-3 text-left">Rating</th>
                        <th class="${_headCell} px-4 py-3 text-left">Score</th>
                    </tr>
                </thead>
                <tbody>${bodyHtml}</tbody>
            </table>
        </div>
    `;
}

function _scrollToMe(container: HTMLElement) {
    const myRow = container.querySelector('#my-standing-row') as HTMLElement | null;
    if (myRow) {
        setTimeout(() => myRow.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
    }
}

export const TournamentPage = {
    template() {
        return `
            <div class="h-[550px] w-[510px] flex flex-col bg-gradient-to-b from-blue-500 via-blue-800 to-neutral-900 shadow-2xl shadow-black border-y border-black text-white rounded-xl p-8 gap-4 overflow-hidden">
                <div class="text-center">
                    <h1 id="tournament-title" class="text-3xl font-bold"></h1>
                    <p class="text-white/70 mt-1">Tournament</p>
                </div>
                <h3 id="info-on-display" class="text-center text-lg font-semibold text-white/90"></h3>
                <div id="tournament-body" class="flex-1 min-h-0 overflow-hidden"></div>
                <button id="quit-btn" class="mx-auto w-48 ${_baseBtn} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/30">
                    Quit Tournament
                </button>
            </div>
        `;
    },

    async init() {
        const titleElement = document.getElementById("tournament-title") as HTMLHeadingElement;
        titleElement.textContent = lobbyService.lobby.name;

        const tournamentBody = document.getElementById("tournament-body") as HTMLDivElement;
        tournamentBody.innerHTML = `<p class="text-white/60 text-center w-full self-center">Waiting for tournament info...</p>`;

        const quitButton = document.getElementById("quit-btn") as HTMLButtonElement;
        quitButton.addEventListener('click', quitTournamentClicked);
    },

    renderStandings() {
        const infoOnDisplayElement = document.getElementById("info-on-display") as HTMLHeadingElement;
        const round = tournamentService.tournament.currentRound;
        infoOnDisplayElement.textContent = round === 0 ? "Initial Standings" : `Standings after round ${round}`;

        const tournamentBody = document.getElementById("tournament-body") as HTMLDivElement;
        tournamentBody.innerHTML = _standingsTable(tournamentService.tournament.participants);
        _scrollToMe(tournamentBody);
    },

    renderFinalStandings() {
        const infoOnDisplayElement = document.getElementById("info-on-display") as HTMLHeadingElement;
        infoOnDisplayElement.textContent = "Final Standings";

        const tournamentBody = document.getElementById("tournament-body") as HTMLDivElement;
        const standings = tournamentService.tournament.participants;
        const winner = standings[0];
        const isIWinner = winner?.id === lobbyService.myID;
        const winnerNameClass = isIWinner ? "text-2xl font-bold text-yellow-300" : "text-2xl font-bold text-yellow-400";

        // Hide the quit button — replaced by the Back to Lobby button below
        const quitBtn = document.getElementById('quit-btn') as HTMLButtonElement;
        if (quitBtn) quitBtn.style.display = 'none';

        tournamentBody.innerHTML = `
            <div class="flex flex-col gap-3 w-full h-full">
                <div class="text-center py-3 px-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex-shrink-0">
                    <p class="text-xs font-semibold uppercase tracking-widest text-yellow-500/70 mb-1">Tournament Winner</p>
                    <p class="${winnerNameClass}">${winner?.nick ?? "—"}</p>
                </div>
                <div class="flex-1 min-h-0">
                    ${_standingsTable(standings)}
                </div>
                <button id="btn-back-to-lobby" class="mx-auto w-48 flex-shrink-0 ${_baseBtn} bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30">
                    Back to Lobby
                </button>
            </div>
        `;
        _scrollToMe(tournamentBody);

        document.getElementById('btn-back-to-lobby')?.addEventListener('click', () => {
            router.navigateTo('/lobby');
        });
    },

    renderPairings() {
        const infoOnDisplayElement = document.getElementById("info-on-display") as HTMLHeadingElement;
        const round = tournamentService.tournament.currentRound;
        infoOnDisplayElement.textContent = `Round ${round} pairings`;

        const tournamentBody = document.getElementById("tournament-body") as HTMLElement;

        let matchCards = "";
        let board = 1;
        tournamentService.tournament.currentPairings.forEach(match => {
            const playerLeft = match.players[0];
            const playerRight = match.players[1];
            const isMyGame = playerLeft.id === lobbyService.myID || playerRight?.id === lobbyService.myID;
            const rowBg = isMyGame ? "bg-emerald-900/20" : (board % 2 === 0 ? "bg-black/20" : "bg-black/30");

            let leftHtml: string;
            let middleHtml: string;
            let rightHtml: string;

            if (match.result === null) {
                // Announcement: name + rating, vs separator
                const leftClass = playerLeft.id === lobbyService.myID ? "font-bold text-emerald-400" : "font-medium text-sky-300";
                const rightClass = playerRight?.id === lobbyService.myID ? "font-bold text-emerald-400" : "font-medium text-sky-300";
                leftHtml = `<div class="text-sm ${leftClass} truncate">${playerLeft.nick}</div>
                            <div class="text-xs text-white/40">${playerLeft.rating}</div>`;
                middleHtml = `<span class="text-white/30 text-xs uppercase tracking-widest">vs</span>`;
                rightHtml = playerRight
                    ? `<div class="text-sm ${rightClass} truncate">${playerRight.nick}</div>
                       <div class="text-xs text-white/40">${playerRight.rating}</div>`
                    : `<div class="text-xs text-white/40 italic">Bye</div>`;
            } else {
                // Results: winner green, loser red
                const leftWon = match.result === 1;
                leftHtml = `<div class="text-sm ${leftWon ? "font-bold text-emerald-400" : "text-red-400"} truncate">${playerLeft.nick}</div>
                            <div class="text-xs text-white/40">${playerLeft.rating}</div>`;
                middleHtml = `<span class="text-white/30 text-xs uppercase tracking-widest">${leftWon ? "beat" : "lost"}</span>`;
                rightHtml = playerRight
                    ? `<div class="text-sm ${!leftWon ? "font-bold text-emerald-400" : "text-red-400"} truncate">${playerRight.nick}</div>
                       <div class="text-xs text-white/40">${playerRight.rating}</div>`
                    : `<div class="text-xs text-white/40 italic">Bye</div>`;
            }

            board++;
            matchCards += `
                <div class="${rowBg} border-b border-white/5 flex items-center px-4 py-3 gap-3">
                    <div class="flex-1 min-w-0">${leftHtml}</div>
                    <div class="shrink-0 w-12 flex items-center justify-center">${middleHtml}</div>
                    <div class="flex-1 min-w-0 text-right">${rightHtml}</div>
                </div>
            `;
        });

        tournamentBody.innerHTML = `
            <div class="h-full overflow-y-auto rounded-xl bg-black/20 border border-white/10">
                <div class="flex items-center px-4 py-3 sticky top-0 bg-blue-950 rounded-t-xl">
                    <div class="flex-1 ${_headCell}">Player</div>
                    <div class="w-12 shrink-0"></div>
                    <div class="flex-1 ${_headCell} text-right">Player</div>
                </div>
                <div>${matchCards}</div>
            </div>
        `;
    }
}
