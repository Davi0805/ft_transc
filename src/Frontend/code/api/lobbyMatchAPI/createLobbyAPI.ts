import { authService } from "../../services/authService";
import { TLobby } from "./getLobbySettingsAPI";

export type TLobbyCreationConfigs = Pick<TLobby, "name" | "host" | "type" | "map" | "mode" | "duration">;

export async function createLobby(lobbySettings: TLobbyCreationConfigs): Promise<void> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at createLobby`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      ``, //TODO Create endpoint to send data
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

    return;
  } catch (error) {
    throw error;
  }
}