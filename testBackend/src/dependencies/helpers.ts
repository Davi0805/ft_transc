import { TLobbyUser, TMap } from "./lobbyTyping.js";

export function getParticipantsAm(users: TLobbyUser[]): number {
    const participants = users.filter(user => user.player !== null);
    return participants.length
}

export function getMaxPlayersFromMap(map: TMap): number {
    const [amountStr, type, _size] = map.split("-");
    const amount = Number(amountStr);

    return (amount * (type === "teams" ? 2 : 1))
}