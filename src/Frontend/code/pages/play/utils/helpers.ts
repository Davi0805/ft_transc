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