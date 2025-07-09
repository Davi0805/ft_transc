import { authService } from "../../services/authService";
import { TDynamicLobbySettings } from "../../pages/play/lobbyTyping";

export async function updateLobby(lobbyID: number, lobbySettings: TDynamicLobbySettings): Promise<void> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at createLobby`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8084/lobby/${lobbyID}`, //TODO: ENDPOINT STILL MISSING IN POSTMAN
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify(lobbySettings)
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: createLobby failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return ;
  } catch (error) {
    throw error;
  }
}