import { authService } from "../../services/authService";

export type TLobbyType = "friendly" | "ranked" | "tournament"
export type TMapType = "2-single-small" | "2-single-medium" | "2-sngle-big" | "4-single-small" | "4-single-medium" | "4-single-big"
    | "2-team-small" | "2-team-medium" | "2-team-big" | "4-team-small" | "4-team-medium" | "4-team-big"
export type TMatchCapacity = { taken: number, max: number }
export type TMatchMode = "classic" | "modern"
export type TMatchDuration = "blitz" | "rapid" | "classical" | "long" | "marathon"

export type TLobby = {
    id: number,
    name: string,
    host: string,
    type: TLobbyType,
    capacity: TMatchCapacity,
    map: TMapType,
    mode: TMatchMode,
    duration: TMatchDuration
}

export async function getLobbySettingsByID(lobbyID: number): Promise<TLobby> {
    try {
        if (!authService.isUserAuthenticated()) {
            const errorMessage: string = `DEBUG: No authToken at getLobbySettingsByID`;
            const error: Error = new Error(errorMessage);
            throw error;
        }

        const response = await fetch(``, { // TODO: create the endpoint
            method: "GET",
            headers: {
                Authorization: `Bearer ${authService.getToken()}`
            }
        });

        if (!response.ok) {
            const errorMessage: string = `DEBUG: getMessagesByConvID failed with status ${response.status}`;
            const error: Error = new Error(errorMessage);
            (error as any).status = response.status;
            throw error;
        }

        return (await response.json()) as TLobby;
    } catch (error) {
        throw error;
    }
}

export async function getLobbySettings(): Promise<TLobby[]> {
    try {
        if (!authService.isUserAuthenticated()) {
            const errorMessage: string = `DEBUG: No authToken at getLobbySettingsByID`;
            const error: Error = new Error(errorMessage);
            throw error;
        }

        const response = await fetch(``, { // TODO: create the endpoint
            method: "GET",
            headers: {
                Authorization: `Bearer ${authService.getToken()}`
            }
        });

        if (!response.ok) {
            const errorMessage: string = `DEBUG: getMessagesByConvID failed with status ${response.status}`;
            const error: Error = new Error(errorMessage);
            (error as any).status = response.status;
            throw error;
        }

        return (await response.json()) as TLobby[];
    } catch (error) {
        throw error;
    }
}