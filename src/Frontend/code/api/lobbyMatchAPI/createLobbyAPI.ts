import { authService } from "../../services/authService";
import { LobbyCreationConfigsDTO, TLobby } from "../../pages/play/lobbyTyping";


export async function createLobby(lobbySettings: LobbyCreationConfigsDTO): Promise<number> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at createLobby`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    console.log(lobbySettings);
    const response = await fetch(`http://localhost:8084/lobby`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lobbySettings),
    });

    if (!response.ok) {
      const errorMessage: string = `DEBUG: createLobby failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    const data = (await response.json()).id as number;
    return data;
  } catch (error) {
    throw error;
  }
}
