import { TMap } from "../lobbyTyping";
import { SIDES, ROLES } from "../../../match/matchSharedDependencies/sharedTypes";

export type TPlayerInSlot = {
    id: number,
    userID: number,
    nickname: string,
    spriteID: number
}

type TTeam = {
    -readonly [key in keyof typeof ROLES]?: TPlayerInSlot | null //The shittiest fucking language I have ever seen in my life
}

export type TSlots = {
    -readonly [key in keyof typeof SIDES]?: TTeam
}


export function getSlotsFromMap(map: TMap): TSlots {
    const [amount, type, _size] = map.split("-");
    const fourPlayers = amount === "4";
    const teams = type === "teams";
    return {
        LEFT: {
            BACK: null,
            ...(teams && { FRONT: null } )
        },
        RIGHT: {
            BACK: null,
            ...(teams && { FRONT: null } )
        },
        ...(fourPlayers && {
            TOP: {
                BACK: null,
                ...(teams && { FRONT: null } )
            },
            BOTTOM: {
                BACK: null,
                ...(teams && { FRONT: null } )
            }
        })
    } as TSlots
}

export function areAllSlotsFull(slots: TSlots): boolean {
    for (const teamName of (Object.keys(slots) as (keyof typeof SIDES)[])) {
        const team = slots[teamName];
        if (!team) { continue };
        for (const roleName of (Object.keys(team) as (keyof typeof ROLES)[])) {
            const player = team[roleName];
            if (player === undefined) { continue; }
            else if (player === null) { return false; }
        }
    }
    return true;
}

//TODO: This should be calculated in the backend!!!!!!!
export function getMaxPlayersFromMap(map: TMap): number {
    const [amountStr, type, _size] = map.split("-");
    const amount = Number(amountStr);

    return (amount * (type === "teams" ? 2 : 1))
}