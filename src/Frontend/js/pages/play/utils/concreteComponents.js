export function getLobbyOptionsHTML(editable, type, {
    name, map, mode, length
} = {name: "", map: "", mode: "", length: ""}) {
    let tagType = "";
    let mapOptionsHtml = "";
    let modeOptionsHtml = ""
    let lengthOptionsHtml = "";

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
            mapOptionsHtml += `<option value="${option}" ${map === option ? "selected" : ""}>${option}</option>`;
        }
        const modeOptions = [
            "classic",
            "modern"
        ]
        
        for (let option of modeOptions) {
            modeOptionsHtml += `<option value="${option}" ${mode === option ? "selected" : ""}>${option}</option>`;
        }
    
        const lengthOptions = [
            "blitz",
            "rapid",
            "classical",
            "long",
            "marathon"
        ]
        
        for (let option of lengthOptions) {
            lengthOptionsHtml += `<option value="${option}" ${length === option ? "selected" : ""}>${option}</option>`;
        }
    } else {
        tagType = "p";
        mapOptionsHtml = map;
        modeOptionsHtml = mode
        lengthOptionsHtml = length;
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
            <label for="match-length" class="text-xl">Match Length:</label>
            <${tagType} id="match-length" name="match-length" class="bg-gray-900/50 rounded-2xl px-4 text-center">
                ${lengthOptionsHtml}
            </${tagType}>
        </div>
    `
}