import { authService } from "../../services/authService";
import { LobbiesListDTO, TLobby } from "../../pages/play/lobbyTyping";


export async function getAllLobbies(): Promise<LobbiesListDTO> {
    try {
        if (!authService.isUserAuthenticated()) {
            const errorMessage: string = `DEBUG: No authToken at getLobbySettingsByID`;
            const error: Error = new Error(errorMessage);
            throw error;
        }
        const response = await fetch(`http://localhost:8084/lobby`, {
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
        //console.log("Response:")
        //console.log(await response.json())
        const lobbiesList: LobbiesListDTO = (await response.json()) as LobbiesListDTO;
        console.log("List of lobbies directly from endpoint: ")
        console.log(lobbiesList)
        return lobbiesList
    } catch (error) {
        throw error;
    }
}