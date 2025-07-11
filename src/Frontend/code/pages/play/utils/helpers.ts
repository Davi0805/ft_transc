import { TSlots } from "../lobbyLogic";
import { TMapType } from "../lobbyTyping";

export function getSlotsFromMap(map: TMapType): TSlots {
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
export function getMaxPlayersFromMap(map: TMapType): number {
    const [amountStr, type, _size] = map.split("-");
    const amount = Number(amountStr);

    return (amount * (type === "teams" ? 2 : 1))
}