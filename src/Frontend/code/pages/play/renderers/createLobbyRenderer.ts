import { TLobbyType } from "../lobbyTyping";
import { FriendlyLobbyRenderer } from "./FriendlyLobbyRenderer";
import { RankedLobbyRenderer } from "./RankedLobbyRenderer";
import { TournamentLobbyRenderer } from "./TournamentLobbyRenderer";

export function createLobbyRenderer(lobbyType: TLobbyType) {
    switch (lobbyType) {
        case "friendly":
            return new FriendlyLobbyRenderer();
        case "ranked":
            return new RankedLobbyRenderer();
        case "tournament":
            return new TournamentLobbyRenderer();
        default:
            throw Error("Unrecognized lobby type")
    }
}