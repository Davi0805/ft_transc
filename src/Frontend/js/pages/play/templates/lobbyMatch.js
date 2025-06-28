import { getButton } from "../utils/stylingComponents.js";

export const LobbyMatchPage = {
    template() {
        return `
            <div class="flex flex-col w-fit items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 overflow-hidden gap-3">
                <h1 id="lobby-title" class="text-3xl p-2"></h1>
                <h3 id="lobby-subtitle" class="text-xl p-1"></h3>
                <div id="lobby-body" class="flex flex-row w-full gap-3">
                    <div id="slots" class="flex flex-col min-w-[300px] border-2 rounded-2xl border-gray-900/75 overflow-hidden">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col justify-between">
                        <div id="lobby-settings">
                        </div>
                        <div id="lobby-buttons" class="flex flex-col gap-1">
                            ${getButton("btn-invite", "button", "Invite").outerHTML}
                            ${getButton("btn-leave", "button", "Leave").outerHTML}
                            ${getButton("btn-ready", "button", "Ready").outerHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
}