import { authService } from "../../services/authService";
import { TLobby } from "../../pages/play/lobbyTyping";

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