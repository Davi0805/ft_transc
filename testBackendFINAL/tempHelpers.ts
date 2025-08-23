import { LobbyUserT } from "./Repositories/LobbyRepository.js";
import { MatchMapT } from "./Repositories/MatchRepository.js";

export function getParticipantsAm(users: LobbyUserT[]): number {
    const participants = users.filter(user => user.player !== null);
    return participants.length
}

export function getMaxPlayersFromMap(map: MatchMapT): number {
    const [amountStr, type, _size] = map.split("-");
    const amount = Number(amountStr);

    return (amount * (type === "teams" ? 2 : 1))
}