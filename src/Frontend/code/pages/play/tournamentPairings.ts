import { lobbyService } from "../../services/LobbyService";
import { tournamentService } from "../../services/tournamentService";
import { getTable } from "./utils/stylingComponents";

export const TournamentPairingsPage = {
    template() {
        return `
            <div class="flex flex-col items-center h-full max-h-[650px] justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <h3 id="current-round"></h3>
                <div id="pairings" class="flex flex-row w-full min-h-0 gap-3 "></div>
            </div>
        `
    },

    async init() {
        const pairingsElement = document.getElementById("pairings") as HTMLElement;

        let participantsTableBody = ""
        let board = 1
        const participants = lobbyService.getTournPlayers();
        const categories = ["nick", "rating", "score"] as const
        tournamentService.pairings.forEach(pair => {
            const bg = `bg-gray-900/${board % 2 === 0 ? "25" : "50"}`;
            const border = pair.players.includes(lobbyService.myID) ? "outine outline-2 outline-red-500" : ""
            participantsTableBody += `<tr class="${bg} ${border}"><td>${board++}</td>`;
            const player1 = participants.find(participant => participant.id === pair.players[0])
            const player2 = participants.find(participant => participant.id === pair.players[1])
            if (!player1 || !player2) { throw Error("Getting tired of this shit") }
            
            categories.forEach(category => {
                participantsTableBody += `<td>${player1[category]}</td>`;
            })
            if (pair.result === null) {
                participantsTableBody += "<td>?</td><td>?</td>"
            } else {
                participantsTableBody += `<td>${pair.result}</td><td>${(pair.result + 1) % 2}</td>`
            }
            for (let i = categories.length - 1; i >= 0; i--) {
                participantsTableBody += `<td>${player1[categories[i]]}</td>`;
            }
            participantsTableBody += "</tr>";
        })

        const participantsTableHead = `
            <tr class="text-xl bg-gray-900/90">
                <td>Board</td><td>Player</td><td>Rt</td><td>Scr</td><td colspan="2">Result</td><td>Scr</td><td>Rt</td><td>Player</td>
            </tr>
        `
        const pairingsTable = getTable("pairings", participantsTableHead, participantsTableBody)
        /* lobbyPairings.innerHTML += pairingsTable.outerHTML;
        lobbyPairings.innerHTML += `
            <p>The match will start soon...</p>
        ` */

        //lobbyBody.appendChild(lobbyPairings)
        pairingsElement.innerHTML = pairingsTable.outerHTML
    }
}