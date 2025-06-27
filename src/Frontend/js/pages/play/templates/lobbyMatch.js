import { getButtonHTML } from "../utils/stylingComponents.js";

export const LobbyMatchPage = {
    template() {
        return `
            <div class="flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-black/40 shadow-sm text-white rounded-lg px-16 py-12 overflow-hidden">
                <h1 id="lobby-title" class="text-3xl p-3"></h1>
                <div id="lobby-body" class="flex flex-row">
                    <div id="slots" class="flex flex-col">
                    </div>
                    <div id="lobby-settings-and-buttons" class="flex flex-col">
                        <div id="lobby-settings">
                        </div>
                        <div id="lobby-buttons" class="flex flex-col">
                            ${getButtonHTML("btn-invite", "button", "Invite")}
                            ${getButtonHTML("btn-leave", "button", "Leave")}
                            ${getButtonHTML("btn-ready", "button", "Ready")}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
}