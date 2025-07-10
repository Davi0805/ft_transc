import { matchService } from "../../services/matchService"

export const MatchPage = {
    template() {
        return `
            <div id="match-root"></div>
        `
    },

    init() {
        matchService.init()
    }
}