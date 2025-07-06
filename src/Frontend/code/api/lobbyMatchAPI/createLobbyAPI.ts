import { authService } from "../../services/authService";
import { TLobby } from "./getLobbySettingsAPI";

export type TLobbyCreationConfigs = Pick<TLobby, "name" | "host" | "type" | "map" | "mode" | "duration">;
type CreationResultData = {lobby_id: number}

export async function createLobby(lobbySettings: TLobbyCreationConfigs): Promise<number> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at createLobby`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8084/lobby`,
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

    const data = (await response.json()) as CreationResultData;
    return data.lobby_id;
  } catch (error) {
    throw error;
  }
}