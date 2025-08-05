import { ALobbyRenderer } from "./ALobbyRenderer";

export class TournamentLobbyRenderer extends ALobbyRenderer {
    constructor() {
        super()
    }

    async renderPlayers(): Promise<void> {
        
    }

    protected readonly subtitleText: string = "Tournament Lobby";
}