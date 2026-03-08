import { TLobbyType } from "../lobbyTyping";
import { TDynamicLobbySettings } from "../lobbyTyping";

// A helper that renders the match settings
// Arguments:
// - editable: The settings are rendered differently whether they are editable or not (depending on the state of the "Change lobby settings button")
//    They are static normal labels usually, but if the user clicks on the button, they become dropdowns
// - type: the type of lobby. It is needed to decide which maps should be an option (for example, ranked matches do not allow for team matches)
// - lobbySettings: The settings to render
export function getLobbyOptionsHTML(editable: boolean, type: TLobbyType, lobbySettings: TDynamicLobbySettings) {
    let tagType = "";
    let mapOptionsHtml = "";
    let modeOptionsHtml = ""
    let durationOptionsHtml = "";

    if (editable) {
        //the tag type must be "select", to make each option a dropdown
        tagType = "select"
        //All options are created in these arrays
        const mapOptions = []
        //By the end of this swich, all map options are in mapOptions[] by the order they should be rendered
        // this is achieved using a switch without breaks (so the bottom options are also included if the switch matched above)
        // and the unshift function, which always places items at the beginning of the array
        switch (type) {
            case "friendly": {
                mapOptions.unshift(...[
                    "2-teams-small",
                    "2-teams-medium",
                    "2-teams-big",
                    "4-teams-small",
                    "4-teams-medium",
                    "4-teams-big"
                ])
            } case "ranked": {
                mapOptions.unshift(...[
                    "4-players-small",
                    "4-players-medium",
                    "4-players-big"
                ])
            } case "tournament": {
                mapOptions.unshift(...[
                    "2-players-small",
                    "2-players-medium",
                    "2-players-big"
                ])
                break ;
            } 
            default: { throw new Error("This lobby type was not recognized!") }
        } 
        const modeOptions = [
            "classic",
            "modern"
        ]
        const lengthOptions = [
            "blitz",
            "rapid",
            "classical",
            "long",
            "marathon"
        ]

        //Creates the html with all the options
        for (let option of mapOptions) {
            mapOptionsHtml += `<option value="${option}" ${lobbySettings.map === option ? "selected" : ""}>${option}</option>`;
        }
        for (let option of modeOptions) {
            modeOptionsHtml += `<option value="${option}" ${lobbySettings.mode === option ? "selected" : ""}>${option}</option>`;
        }
        for (let option of lengthOptions) {
            durationOptionsHtml += `<option value="${option}" ${lobbySettings.duration === option ? "selected" : ""}>${option}</option>`;
        }
    } else {
        //If options are not editable, a single p tag with the selected option will suffice
        tagType = "p";
        mapOptionsHtml = lobbySettings.map;
        modeOptionsHtml = lobbySettings.mode
        durationOptionsHtml = lobbySettings.duration;
    }



    const selectClass = "h-11 w-full rounded-3xl border-2 border-black/20 bg-white text-base pl-5 pr-10 font-medium text-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in appearance-none";
    const displayClass = "px-4 py-3 bg-black/30 rounded-full text-base border border-white/10 font-medium";
    const chevron = `<div class="absolute inset-y-0 right-3 flex items-center pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>`;

    if (editable) {
        return `
            <div class="flex flex-row items-center justify-between gap-4">
                <label for="match-map" class="text-base font-medium text-white/90 min-w-fit shrink-0">Map</label>
                <div class="relative flex-1 min-w-0">
                    <select id="match-map" name="match-map" class="${selectClass}">${mapOptionsHtml}</select>
                    ${chevron}
                </div>
            </div>
            <div class="flex flex-row items-center justify-between gap-4">
                <label for="match-mode" class="text-base font-medium text-white/90 min-w-fit shrink-0">Mode</label>
                <div class="relative flex-1 min-w-0">
                    <select id="match-mode" name="match-mode" class="${selectClass}">${modeOptionsHtml}</select>
                    ${chevron}
                </div>
            </div>
            <div class="flex flex-row items-center justify-between gap-4">
                <label for="match-duration" class="text-base font-medium text-white/90 min-w-fit shrink-0">Duration</label>
                <div class="relative flex-1 min-w-0">
                    <select id="match-duration" name="match-duration" class="${selectClass}">${durationOptionsHtml}</select>
                    ${chevron}
                </div>
            </div>
        `;
    }

    return `
        <div class="mb-5">
            <label class="block mb-2 font-medium text-white/90">Map</label>
            <p id="match-map" class="${displayClass}">${mapOptionsHtml}</p>
        </div>
        <div class="mb-5">
            <label class="block mb-2 font-medium text-white/90">Mode</label>
            <p id="match-mode" class="${displayClass}">${modeOptionsHtml}</p>
        </div>
        <div class="mb-5">
            <label class="block mb-2 font-medium text-white/90">Duration</label>
            <p id="match-duration" class="${displayClass}">${durationOptionsHtml}</p>
        </div>
    `
}