import { PaddleCarrossel } from "../../../components/carrossel/paddleCarrossel";
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
        //As this is a friendly match, the customize player window should show up when the join button is clicked
        slotJoinElement.addEventListener('click', async () => this.renderCustomizePlayerWindow(SIDES[teamName], ROLES[roleName]))
        slotSpaceElement.appendChild(slotJoinElement);
    }


    protected _renderWithdrawButton(playerDiv: HTMLDivElement, player: TPlayerInSlot): void {
        const withdrawButton = getButton("btn-withdraw", "button", "X", false);
        //Withdraw the right type of player when the withdraw button is clicked
        withdrawButton.addEventListener("click", () => withdrawFriendlyClicked(player.id))
        playerDiv.appendChild(withdrawButton);
    }

    private renderCustomizePlayerWindow(team: SIDES, role: ROLES) {
        const directions = getDirectionsFromTeam(team);
        
        const leftKey = "Arrow" + directions.left
        const rightKey = "Arrow" + directions.right

  

        const settingsDialog = document.createElement('dialog');
        settingsDialog.className = "flex flex-col m-auto px-16 py-10 rounded-xl bg-[rgb(20,20,20)] shadow-2xl shadow-black border-y border-black text-white"
        settingsDialog.innerHTML = `
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-white mb-2">Game Settings</h1>
                    <p class="text-white/70">Customize your game settings</p>
                </div>

                <form id="player-settings" method="dialog" class="space-y-6">
                    <!-- Alias Section -->
                    <div>
                        <label for="player-alias" class="block text-base font-semibold text-white mb-2">Alias</label>
                        <input 
                            id="player-alias" 
                            name="player-alias" 
                            type="text" 
                            class="h-11 w-[350px] ml-auto rounded-3xl border-2 border-black/20 bg-myWhite px-[20px] py-[20px] pr-[45px] text-base font-medium text-black caret-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in" 
                            placeholder="Enter your alias"
                            required
                        />
                    </div>

                    <!-- Paddle Section -->
                    <div>
                        <label class="block text-base font-semibold text-white mb-2">Paddle</label>
                        ${PaddleCarrossel.getPaddleCarrosselHTML()}
                    </div>



                    <!-- Controls Section -->
                    <div class="flex flex-col gap-2 items-center">
                        <h2 class="text-base font-semibold text-white mb-2">Controls</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2 ">
                                <label for="left-listener" class="block text-base font-semibold text-white text-center">Up Button</label>
                                <button 
                                    type="button" 
                                    id="left-listener" 
                                    class="px-4 py-3 bg-slate-600/80 border border-slate-500/50 rounded-xl text-white text-base cursor-pointer transition-all duration-200 text-center font-semibold hover:bg-slate-600/90 hover:border-blue-500 active:bg-blue-500/20"
                                >ArrowUp</button>
                                <input type="hidden" id="left-key" name="left-key" value="ArrowUp">
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="right-listener" class="block text-base font-semibold text-white text-center">Down Button</label>
                                <button 
                                    type="button" 
                                    id="right-listener" 
                                    class="px-4 py-3 bg-slate-600/80 border border-slate-500/50 rounded-xl text-white text-base cursor-pointer transition-all duration-200 text-center font-semibold hover:bg-slate-600/90 hover:border-blue-500 active:bg-blue-500/20"
                                >ArrowDown</button>
                                <input type="hidden" id="right-key" name="right-key" value="ArrowDown">
                            </div>
                        </div>
                    </div>


                    <!-- Submit Button -->
                    <button type="submit" id="btn-close-dialog" class="block mx-auto rounded-lg bg-blue-600  px-6 py-2 font-semibold text-myWhite transform active:scale-85 transition-all duration-100 hover:bg-blue-700">
                        Join Game
                    </button>
                </form>
        `;


        document.body.appendChild(settingsDialog);

        
        const leftListener = document.getElementById("left-listener") as HTMLButtonElement
        const rightListener = document.getElementById("right-listener") as HTMLButtonElement
        const leftInput = document.getElementById("left-key") as HTMLInputElement
        const rightInput = document.getElementById("right-key") as HTMLInputElement

        setupKeyCaptureButton(leftListener, leftInput)
        setupKeyCaptureButton(rightListener, rightInput)

        // constructor inits event listeners
        const paddleCarrossel = new PaddleCarrossel(
            "paddle-prev",
            "paddle-next",
            "paddle-image",
            "player-paddle"
        );



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