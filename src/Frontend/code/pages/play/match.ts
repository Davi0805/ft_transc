import { matchService } from "../../services/matchService"

export const MatchPage = {
    template() {
        return `
            <div id="match-root"></div>
        `
    },

    init() {
        const root = document.getElementById("match-root");
        if (!root) { throw Error("Game root element could not be found!"); }
        matchService.start(root);
    }
}