import { TMap } from "../lobbyTyping";
import { SIDES, ROLES } from "../../../match/matchSharedDependencies/sharedTypes";

type TPlayerInSlot = {
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

//TODO: This should be calculated in the backend!!!!!!!
export function getMaxPlayersFromMap(map: TMap): number {
    const [amountStr, type, _size] = map.split("-");
    const amount = Number(amountStr);

    return (amount * (type === "teams" ? 2 : 1))
}