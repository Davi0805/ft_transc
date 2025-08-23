import { lobbyService } from "../../services/LobbyService";
import { tournamentService } from "../../services/tournamentService";
import { getTable } from "./utils/stylingComponents";

export const TournamentPage = {
    template() {
        return `
            <div class="flex flex-col items-center h-full max-h-[650px] justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <h1 id="tournament-title" class="text-3xl p-2"></h1>
                <h3 id="tournament-subtitle" class="text-xl p-1">Tournament</h3>
                <h3 id="current-round"></h3>
                <div id="pairings" class="flex flex-row w-full min-h-0 gap-3 "></div>
            </div>
        `
    },

    async init() {
        const titleElement = document.getElementById("tournament-title") as HTMLHeadingElement;
        titleElement.textContent = lobbyService.lobby.name;
        const currentRoundElement = document.getElementById("current-round") as HTMLHeadingElement;
        //currentRoundElement.textContent = `Round ${lobbyService.lobby.round}` //Round probably needs to be in tournament service?


        const pairingsElement = document.getElementById("pairings") as HTMLElement;

        let participantsTableBody = ""
        let board = 1
        const participants = lobbyService.getTournPlayers();
        console.log("participants: ", participants)
        const categories = ["nick", "rating", "score"] as const
        const paddingLength = 6
        tournamentService.pairings.forEach(pair => {
            const bg = `bg-gray-900/${board % 2 === 0 ? "25" : "50"}`;
            const border = pair.players.includes(lobbyService.myID) ? "border-2 border-red-500" : ""
            participantsTableBody += `<tr class="${bg} ${border}"><td class="px-${paddingLength}">${board++}</td>`;
            const player1 = participants.find(participant => participant.id === pair.players[0])
            const player2 = participants.find(participant => participant.id === pair.players[1])
            if (!player1 || !player2) { throw Error("Getting tired of this shit") }
            
            categories.forEach(category => {
                participantsTableBody += `<td class="px-${paddingLength}">${player1[category]}</td>`;
            })
            if (pair.result === null) {
                participantsTableBody += `<td class="px-${paddingLength}">?</td><td class="px-${paddingLength}">?</td>`
            } else {
                participantsTableBody += `<td class="px-${paddingLength}">${pair.result}</td><td class="px-${paddingLength}">${(pair.result + 1) % 2}</td>`
            }
            for (let i = categories.length - 1; i >= 0; i--) {
                participantsTableBody += `<td class="px-${paddingLength}">${player2[categories[i]]}</td>`;
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
        pairingsElement.innerHTML = pairingsTable.outerHTML
    }
}