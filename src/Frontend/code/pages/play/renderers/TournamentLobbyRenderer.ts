import { lobbyService } from "../../../services/LobbyService"; //I tried, but I do not know how to get rid of this dependency
import { joinWithdrawTournamentClicked } from "../buttonCallbacks";
import { getButton, getTable, toggleButton } from "../utils/stylingComponents";
import { ALobbyRenderer } from "./ALobbyRenderer";

export class TournamentLobbyRenderer extends ALobbyRenderer {
    constructor() {
        super()
    }

    //In the tournament's case, the player table is a simple list of participants
    async renderPlayers(): Promise<void> {
        const participantsElement = document.getElementById('players') as HTMLElement;
        //Prepares the table of participants that will be updated when someone joins
        const participantsTableElement = document.createElement("div");
        participantsTableElement.id = "participants-table";
        participantsTableElement.className = "h-full"
        participantsElement.appendChild(participantsTableElement);

        this._renderTournamentTable()
        
        //The join/withdraw button at the bottom
        const joinWithdrawButton = getButton("btn-join-withdraw", "button", "Join", false)
        joinWithdrawButton.addEventListener("click", () => {
            const state = toggleButton(joinWithdrawButton, "Withdraw", "Join")
            joinWithdrawTournamentClicked(state)
        })
        joinWithdrawButton.classList.add("w-full");

        participantsElement.appendChild(joinWithdrawButton)
    }

    async updatePlayers(): Promise<void> {
        //Only updates the table (NOT the join button!)
        this._renderTournamentTable()
    }

    private _renderTournamentTable() {
        //Info from service
        // Check TTournamentParticipant type for the info that is returned
        const tournamentParticipants = lobbyService.getTournPlayers();

        const tableElement = document.getElementById("participants-table");
        if (!tableElement) {throw Error("Tournament table element was not found")}
        tableElement.innerHTML = ""
        
        const header = document.createElement("h2");
        header.className = "text-center text-2xl bg-gray-900/75 p-1"
        header.textContent = "Participants";
        tableElement.appendChild(header)


        let participantsTableBody = ""
        let place = 1
        const categories = ["nick", "rating", "score"] as const
        for (let participant of tournamentParticipants) {
            const opacity = `opacity-${participant.participating ? "100" : "25"}`
            const bg = `bg-gray-900/${place % 2 === 0 ? "25" : "50"}`;
            participantsTableBody += `<tr class="${bg} ${opacity}"><td>${place++}</td>`;
            categories.forEach(category => {
                participantsTableBody += `<td>${participant[category]}</td>`;
            })
            participantsTableBody += "</tr>";
        }

        const participantsTableHead = `
            <tr class="text-xl bg-gray-900/90">
                <td>Place</td><td>Player</td><td>Rating</td><td>Score</td>
            </tr>
        `
        const participantsTable = getTable("participants", participantsTableHead, participantsTableBody)
        tableElement.innerHTML += participantsTable.outerHTML;
    }

    protected readonly subtitleText: string = "Tournament Lobby";
}