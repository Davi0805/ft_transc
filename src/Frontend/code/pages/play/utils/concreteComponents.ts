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



    return `
        <div class="flex flex-row items-center justify-between gap-4">
            <label for="match-map" class="text-base font-medium text-white/90 min-w-fit">Map</label>
            <${tagType} id="match-map" name="match-map" class="h-11 w-[350px] ml-auto rounded-3xl border-2 border-black/20 bg-myWhite text-base pl-[20px] font-medium  text-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in">
                ${mapOptionsHtml}
            </${tagType}>
        </div>
        <div class="flex flex-row items-center justify-between gap-4">
            <label for="match-mode" class="text-base font-medium text-white/90 min-w-fit">Mode</label>
            <${tagType} id="match-mode" name="match-mode" class="h-11 w-[350px] ml-auto rounded-3xl border-2 border-black/20 bg-myWhite text-base pl-[20px] font-medium  text-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in">
                ${modeOptionsHtml}
            </${tagType}>
        </div>
        <div class="flex flex-row items-center justify-between gap-4">
            <label for="match-duration" class="text-base font-medium text-white/90 min-w-fit">Duration</label>
            <${tagType} id="match-duration" name="match-duration" class="h-11 w-[350px] ml-auto rounded-3xl border-2 border-black/20 bg-myWhite text-base pl-[20px] font-medium  text-black outline-none focus:border-transparent focus:ring-2 focus:ring-blue-300  transition-all duration-200 ease-in">
                ${durationOptionsHtml}
            </${tagType}>
        </div>
    `
}