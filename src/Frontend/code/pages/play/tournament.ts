import { lobbyService } from "../../services/LobbyService";
import { tournamentService } from "../../services/tournamentService";
import { getTable } from "./utils/stylingComponents";




//TODO TAKE CARE OF DIFFERENT RENDERINGS!! START WITH DISPLAY OF CLASSIFICATION TABLE






export const TournamentPage = {
    template() {
        return `
            <div class="flex flex-col items-center h-full max-h-[650px] justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <h1 id="tournament-title" class="text-3xl p-2"></h1>
                <h3 id="tournament-subtitle" class="text-xl p-1">Tournament</h3>
                <h3 id="current-round"></h3>
                <div id="tournament-body" class="flex flex-row w-full min-h-0 gap-3 "></div>
            </div>
        `
    },

    async init() {
        const titleElement = document.getElementById("tournament-title") as HTMLHeadingElement;
        titleElement.textContent = lobbyService.lobby.name;
        const currentRoundElement = document.getElementById("current-round") as HTMLHeadingElement;
        const round = tournamentService.tournament.currentRound;
        currentRoundElement.textContent = round === 0
            ? "Initial Standings"
            : `Standings after round ${round}`;

        const tournamentBody = document.getElementById("tournament-body") as HTMLDivElement;
        tournamentBody.textContent = "Waiting for tournament info..."
    },

    renderStandings() {
        const tournamentBody = document.getElementById("tournament-body") as HTMLDivElement;
        const standings = tournamentService.tournament.participants;

        const standingsHead = `
            <tr class="text-xl bg-gray-900/90">
                <td>Place</td>
                <td>Name</td>
                <td>Rating</td>
                <td>Points</td>
            </tr>
        `;

        const categories = ["nick", "rating", "score"] as const ;
        let place = 1;
        let standingsBody = "";
        standings.forEach(player => {
            const bg = `bg-gray-900/${place % 2 === 0 ? "25" : "50"}`;
            const border = player.id === lobbyService.myID ? "border-2 border-red-500" : ""
            standingsBody += `<tr class="${bg} ${border}"><td>${place++}</td>`;
            categories.forEach(category => {
                standingsBody += `<td>${player[category]}</td>`
            })
            standingsBody += `<tr>`
        })

        const pairingsTable = getTable("standings", standingsHead, standingsBody)
        tournamentBody.innerHTML = pairingsTable.outerHTML

        console.log(tournamentBody.innerHTML)
    },

    renderPairings() {
        const tournamentBody = document.getElementById("tournament-body") as HTMLElement;

        let participantsTableBody = ""
        let board = 1
        const participants = lobbyService.getTournPlayers();
        console.log("participants: ", participants)
        const categories = ["nick", "rating", "score"] as const
        const paddingLength = 6
        tournamentService.tournament.currentPairings.forEach(match => {
            const bg = `bg-gray-900/${board % 2 === 0 ? "25" : "50"}`;
            const isMyGame = match.players[0].id === lobbyService.myID || match.players[1].id === lobbyService.myID
            const border = isMyGame ? "border-2 border-red-500" : ""
            participantsTableBody += `<tr class="${bg} ${border}"><td class="px-${paddingLength}">${board++}</td>`;
            
            categories.forEach(category => {
                participantsTableBody += `<td class="px-${paddingLength}">${match.players[0][category]}</td>`;
            })
            if (match.result === null) {
                participantsTableBody += `<td class="px-${paddingLength}">?</td><td class="px-${paddingLength}">?</td>`
            } else {
                participantsTableBody += `<td class="px-${paddingLength}">${match.result}</td><td class="px-${paddingLength}">${(match.result + 1) % 2}</td>`
            }
            for (let i = categories.length - 1; i >= 0; i--) {
                participantsTableBody += `<td class="px-${paddingLength}">${match.players[1][categories[i]]}</td>`;
            }
            participantsTableBody += "</tr>";
        })

        const participantsTableHead = `
            <tr class="text-xl bg-gray-900/90">
                <td class="px-${paddingLength}">Board</td>
                <td class="px-${paddingLength}">Player</td>
                <td class="px-${paddingLength}">Rt</td>
                <td class="px-${paddingLength}">Scr</td>
                <td colspan="2" class="px-${paddingLength}">Result</td>
                <td class="px-${paddingLength}">Scr</td>
                <td class="px-${paddingLength}">Rt</td>
                <td class="px-${paddingLength}">Player</td>
            </tr>
        `
        const pairingsTable = getTable("pairings", participantsTableHead, participantsTableBody)
        tournamentBody.innerHTML = pairingsTable.outerHTML
    }
}