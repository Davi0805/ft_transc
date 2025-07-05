/* type TLobbyType = "friendly" | "ranked" | "tournament"
type TMapType = "1v1-small" | "1v1-medium" | "1v1-big" | "1v1v1v1-small" | "1v1v1v1-medium" | "1v1v1v1-big"
    | "2v2-small" | "2v2-medium" | "2v2-big" | "2v2v2v2-small" | "2v2v2v2-medium" | "2v2v2v2-big"
type TMatchMode = "classic" | "modern"
type TMatchDuration = "blitz" | "rapid" | "classical" | "long" | "marathon"

export type TLobbySettings = {
    id: number,
    name: string,
    map: TMapType,
    mode: TMatchMode,
    duration: TMatchDuration
} */

export function getLobbyOptionsHTML(editable: boolean, type: TLobbyType, lobbySettings: TLobbySettings) {
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
                    "2v2-small",
                    "2v2-medium",
                    "2v2-big",
                    "2v2v2v2-small",
                    "2v2v2v2-medium",
                    "2v2v2v2-big"
                ])
            } case "ranked": {
                mapOptions.unshift(...[
                    "1v1v1v1-small",
                    "1v1v1v1-medium",
                    "1v1v1v1-big"
                ])
            } case "tournament": {
                mapOptions.unshift(...[
                    "1v1-small",
                    "1v1-medium",
                    "1v1-big"
                ])
                break ;
            } 
            default: { throw new Error("GAVE SHIT") }
        } 
        
        for (let option of mapOptions) {
            mapOptionsHtml += `<option value="${option}" ${lobbySettings?.map === option ? "selected" : ""}>${option}</option>`;
        }
        const modeOptions = [
            "classic",
            "modern"
        ]
        
        for (let option of modeOptions) {
            modeOptionsHtml += `<option value="${option}" ${lobbySettings?.mode === option ? "selected" : ""}>${option}</option>`;
        }
    
        const lengthOptions = [
            "blitz",
            "rapid",
            "classical",
            "long",
            "marathon"
        ]
        
        for (let option of lengthOptions) {
            durationOptionsHtml += `<option value="${option}" ${lobbySettings?.duration === option ? "selected" : ""}>${option}</option>`;
        }
    } else {
        tagType = "p";
        mapOptionsHtml = lobbySettings?.map;
        modeOptionsHtml = lobbySettings?.mode
        durationOptionsHtml = lobbySettings?.duration;
    }



    return `
        <div class="flex flex-row w-full justify-between gap-1">
            <label for="match-map" class="text-xl">Map:</label>
            <${tagType} id="match-map" name="lobby-map" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                ${mapOptionsHtml}
            </${tagType}>
        </div>
        <div class="flex flex-row w-full justify-between gap-1">
            <label for="match-mode" class="text-xl">Mode:</label>
            <${tagType} id="match-mode" name="match-mode" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                ${modeOptionsHtml}
            </${tagType}>
        </div>
        <div class="flex flex-row w-full justify-between gap-1">
            <label for="match-duration" class="text-xl">Match duration:</label>
            <${tagType} id="match-duration" name="match-duration" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                ${durationOptionsHtml}
            </${tagType}>
        </div>
    `
}