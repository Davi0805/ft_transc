import { authService } from "../../services/authService";
import { LobbyCreationConfigsDTO, TLobby } from "../../pages/play/lobbyTyping";

type CreationResultData = {lobby_id: number}

export async function createLobby(lobbySettings: LobbyCreationConfigsDTO): Promise<TLobby> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at createLobby`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    console.log(lobbySettings)
    const response = await fetch(
      `http://localhost:8084/lobby`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
          "Content-Type": "application/json",
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

    const data = (await response.json()) as TLobby;
    return data;
  } catch (error) {
    throw error;
  }
}