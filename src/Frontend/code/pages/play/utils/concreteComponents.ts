import { TLobbyType } from "../lobbyTyping";
import { TDynamicLobbySettings } from "../lobbyTyping";

export function getLobbyOptionsHTML(editable: boolean, type: TLobbyType, lobbySettings: TDynamicLobbySettings) {
    let tagType = "";
    let mapOptionsHtml = "";
    let modeOptionsHtml = ""
    let durationOptionsHtml = "";

    if (editable) {
        tagType = "select"
        const mapOptions = []
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
            default: { throw new Error("GAVE SHIT") }
        } 
        
        for (let option of mapOptions) {
            mapOptionsHtml += `<option value="${option}" ${lobbySettings.map === option ? "selected" : ""}>${option}</option>`;
        }
        const modeOptions = [
            "classic",
            "modern"
        ]
        
        for (let option of modeOptions) {
            modeOptionsHtml += `<option value="${option}" ${lobbySettings.mode === option ? "selected" : ""}>${option}</option>`;
        }
    
        const lengthOptions = [
            "blitz",
            "rapid",
            "classical",
            "long",
            "marathon"
        ]
        
        for (let option of lengthOptions) {
            durationOptionsHtml += `<option value="${option}" ${lobbySettings.duration === option ? "selected" : ""}>${option}</option>`;
        }
    } else {
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