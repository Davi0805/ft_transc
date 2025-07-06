import { router } from "../../routes/router";
import { getButton, getTable } from "./utils/stylingComponents";
import { TLobbySettings, getLobbyOptionsHTML } from "./utils/concreteComponents";
import { getLobbySettingsByID, TLobby } from "../../api/lobbyMatchAPI/getLobbySettingsAPI";
import { lobbySocketService } from "../../services/lobbySocketService";


//IMPORTANT TODO!!!!!!
//Must pass the functionality of the buttons to each lobby!! Separates rendering from logic, and allows to pass different configs

export const LobbyPage = {
    template() {
        return `
            <div class="flex flex-col items-center h-full max-h-[650px] justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 gap-3 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <div id="lobby-body" class="flex flex-row w-full min-h-0 gap-3">
                    <div id="participants" class="flex flex-col min-w-[300px] border-2 rounded-2xl border-gray-900/75 min-h-0 overflow-hidden">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col justify-between gap-6">
                        <div id="lobby-settings">
                        </div>
                        <div id="lobby-buttons" class="flex flex-col gap-1">
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() { //TODO: Doublecheck this does not break anything
        const lobbySettings = await getLobbySettingsByID(lobbySocketService.lobbyID);

        const titleElement = document.getElementById('lobby-title') as HTMLElement;
        titleElement.textContent = lobbySettings.name
        const subtitleElement = document.getElementById('lobby-subtitle') as HTMLElement;
        switch (lobbySettings.type) {
            case "friendly": subtitleElement.textContent = "Friendly Match Lobby"; break;
            case "ranked": subtitleElement.textContent = "Ranked Match Lobby"; break;
            case "tournament": subtitleElement. textContent = "Tournament Lobby"; break;
            default: throw new Error("GAVE SHIT");
        }
        
        this.renderSlots(true);
        this.renderSettings();
        this.activateButtons();

        console.log('Lobby Ranked page loaded!')

        /* const isHost = false //ask redis if is host
        if (isHost) {
            const startButton = document.getElementById('btn-start') as HTMLElement
            startButton.addEventListener('click', () => {
                const everyoneReady = false; //TODO: Ask db if everyone is ready
                if (everyoneReady) {
                    //TODO: Logic to start the game
                    this.startGame(websocket)
                    console.log("Everyone is ready. Starting game...")
                } else {
                    startButton.textContent = "Not everyone is ready!"
                    setTimeout(() => {
                        startButton.textContent = "Start"
                    }, 1000)
                }
            })
        } */
    },

    async renderSettings() {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        const lobbySettingsListing: TLobby = await getLobbySettingsByID(lobbySocketService.lobbyID)

        let lobbySettingsHtml = `
            <div id="settings-listing" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(false, "friendly", lobbySettingsListing)}
                ${getButton("btn-change-settings", "button", "Change lobby settings", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const buttonChangeSettings = document.getElementById('btn-change-settings') as HTMLElement;
        buttonChangeSettings.addEventListener('click', () => this.renderChangeSettings(lobbySettingsListing))
    },

    renderChangeSettings(lobbySettingsListing: TLobbySettings) {
        const lobbySettingsElement = document.getElementById('lobby-settings') as HTMLElement;
        let lobbySettingsHtml = `
            <form id="settings-change-form" class="flex flex-col gap-1">
                ${getLobbyOptionsHTML(true, "friendly", lobbySettingsListing)}
                ${getButton("apply-lobby-settings", "submit", "Apply", false).outerHTML}
            </div>
        `;
        lobbySettingsElement.innerHTML = lobbySettingsHtml;

        const formChangeSettings = document.getElementById('settings-change-form') as HTMLElement;
        formChangeSettings.addEventListener('submit', async (e) => {
            e.preventDefault();
            //TODO: Update the database here with new lobby settings
            console.log("New settings applied!")
            this.renderSettings()
        })
    },


    activateButtons() {
        const buttonsDiv = document.getElementById("lobby-buttons") as HTMLElement;

        const inviteButton = getButton("btn-invite", "button", "Invite");
        inviteButton.addEventListener('click', () => {
            //TODO: ADD INVITE LOGIC HERE
            console.log("Invite button was clicked")
        })
        buttonsDiv.appendChild(inviteButton);

        const leaveButton = getButton("btn-leave", "button", "Leave");
        leaveButton.addEventListener('click', () => {
            if (this.participating) {
                //TODO: tell db that player is not participating anymore!
                this.participating = false
            }
            //TODO: ADD COMM TO DB THAT PLAYER LEFT
            console.log("Leave button was clicked")

            router.navigateTo('/play')
        })
        buttonsDiv.appendChild(leaveButton);

        const readyButton = getButton("btn-ready", "button", "Ready");
        readyButton.addEventListener('click', () => {
            if (!this.participating) {
                readyButton.textContent = "You must join first!"
                setTimeout(() => {
                    readyButton.textContent = "Ready"
                }, 1000)
                return
            }
            //TODO: ADD COMM TO DB THAT PLAYER IS READY
            readyButton.classList.toggle("active");
            const isActive = readyButton.classList.contains("active");
            console.log("button is now ", isActive ? "DOWN" : "UP");
            if (isActive) {
                //TODO: COMM WITH DB SAYING THAT PLAYER IS READY
                readyButton.textContent = "I'm ready! (cancel...)"
                readyButton.classList.remove("bg-gray-900/50") //the normal color
                readyButton.classList.add("bg-gray-900/25") //the active color
            } else {
                //TODO: COMM WITH DB SAYING THAT PLAYER IS NOT READY
                readyButton.textContent = "Ready"
                readyButton.classList.remove("bg-gray-900/25") //the active color
                readyButton.classList.add("bg-gray-900/50") //the normal color
            }
        });
        buttonsDiv.appendChild(readyButton);

        const isHost = true; //TODO: Ask db if this client is host
        if (isHost) {
            const startButton = getButton("btn-start", "button", "Start");
            buttonsDiv.appendChild(startButton);
            
        }
    },

    //TODO friendly and ranked are starting to have a lot of differences. Maybe find a way to put the common things in one place here and pass the differences to their respective objects
    renderSlots(useDefaultSettings: boolean) {
        const slots = {
            LEFT: {
                back: 123
            },
            RIGHT: {
                front: -1,
                back: -1
            },
            TOP: {
                front: -1,
            },
            BOTTOM: {
                front: 321,
                back: -1
            },
        } //TODO: This has to be a function that returns this object

        const teamsElement = document.getElementById('participants') as HTMLElement;
        teamsElement.innerHTML = "";
        const slotsTable = document.createElement('table');
        for (const [team, roles] of Object.entries(slots)) {
            const teamElement = document.createElement("tr");
    
            const teamNameElement = document.createElement("td");
            teamNameElement.className = "bg-gray-900/75 text-2xl"
            teamNameElement.colSpan = 2;
            teamNameElement.textContent = team;
            teamElement.appendChild(teamNameElement);
            slotsTable.appendChild(teamElement);
            
            for (const [role, player] of Object.entries(roles)) {
                const slotElement = document.createElement("tr");
                slotElement.className = "border-b border-gray-900/50"

                const roleNameElement = document.createElement("td");
                roleNameElement.className = "text-xl p-2 bg-gray-900/50 w-0"
                roleNameElement.textContent = role;
                slotElement.appendChild(roleNameElement)
                
                const slotSpaceElement = document.createElement("td");
                slotSpaceElement.className = "text-center"
                if (player === -1 && (!useDefaultSettings || !this.participating)) {
                    const slotJoinElement = getButton(`join-${team}-${role}`, "button", "Join", false);
                    slotJoinElement.addEventListener('click', async () => {
                        if (!useDefaultSettings) {
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
                                        <select id="player-paddle" name="player-alias" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                        </select>
                                    </div>

                                    ${getButton("btn-close-dialog", "submit", "Join", false).outerHTML}
                                </form>
                            `;
                            document.body.appendChild(settingsDialog);
                            const closeDialogButton = document.getElementById("btn-close-dialog") as HTMLElement;
                            closeDialogButton.addEventListener("click", (e) => {
                                const form = settingsDialog.querySelector("form") as HTMLFormElement;
                                if (!form.reportValidity()) return;
                                e.preventDefault();
                                const aliasInput = document.getElementById("player-alias") as HTMLInputElement;
                                const alias = aliasInput.value;
                                const paddleIdInput = document.getElementById("player-paddle") as HTMLInputElement;
                                const paddleId = paddleIdInput.value
                                //TODO: add the player to this slot in the backend
                                //The slot would consist in vars team + role
                                //Use the above chosen settings!!
                                console.log(`Player saved with alias ${alias} and paddle id ${paddleId}`)
                                console.log(`Player added to team ${team} and role ${role}!`) //How to have access to userid?
                                this.participating = true
                                this.renderSlots(useDefaultSettings);
                                settingsDialog.close();
                                settingsDialog.remove();
                            })
                            settingsDialog.showModal();
                        } else {
                            //TODO: add the player to this slot in the backend
                            //The slot would consist in vars team + role
                            //Should be fetched from the user's settings!

                            console.log(`Player added to team ${team} and role ${role}!`) //How to have access to userid?
                            this.participating = !this.participating
                            this.renderSlots(useDefaultSettings);
                        }
                    })
                    slotSpaceElement.appendChild(slotJoinElement);
                } else if (player !== -1) {
                    //TODO should find a way to identify if player is current user and add a withdraw button
                    const playerElement = document.createElement("p");
                    playerElement.className = "text-xl p-2"
                    playerElement.textContent = player.toString();
                    slotSpaceElement.appendChild(playerElement);
                }
                slotElement.appendChild(slotSpaceElement);
                slotsTable.appendChild(slotElement);
            }
        }
        teamsElement.appendChild(slotsTable);
    },

    renderParticipants() {
        const participants = [
            {
                nick: "artuda-s",
                rank: 1800,
                score: 3
            },
            {
                nick: "dmelo-ca",
                rank: 1600,
                score: 1
            },
            {
                nick: "ndo-vale",
                rank: 1700,
                score: 0
            }
        ] //TODO: GET THIS FROM DB. DO NOT FORGET TO ORDER BT POINTS!!!!


        const participantsElement = document.getElementById('participants') as HTMLElement;

        const header = document.createElement("h2");
        header.className = "text-center text-2xl bg-gray-900/75 p-1"
        header.textContent = "Participants";
        participantsElement.appendChild(header)


        let participantsTableBody = ""
        let place = 1
        for (let participant of participants) {
            participantsTableBody += `<tr class="bg-gray-900/${place % 2 === 0 ? "25" : "50"}"><td>${place++}</td>`;
            Object.values(participant).forEach(info => {
                participantsTableBody += `<td>${info}</td>`
            })
            participantsTableBody += "</tr>";
        }

        const participantsTableHead = `
            <tr class="text-xl bg-gray-900/90">
                <td>Place</td><td>Player</td><td>rank</td><td>score</td>
            </tr>
        `
        const participantsTable = getTable("participants", participantsTableHead, participantsTableBody)
        participantsElement.innerHTML += participantsTable.outerHTML;
        

        const joinWithdrawButton = getButton("btn-join-withdraw", "button", this.participating ? "Withdraw" : "Join", false)
        joinWithdrawButton.classList.add("w-full");

        participantsElement.appendChild(joinWithdrawButton)
    },

    participating: false //This should be gotten from redis
}