//TODO do not forget to update the actual api!

import { LobbiesListDTO, LobbyCreationConfigsDTO } from "../pages/play/lobbyTyping";

export async function getAllLobbies(): Promise<LobbiesListDTO> {
    const response = await fetch(`http://localhost:6969/getAllLobbies`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorMessage: string = `DEBUG: getMessagesByConvID failed with status ${response.status}`;
        const error: Error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
    }
    return await response.json()
}

export async function createLobby(lobbySettings: LobbyCreationConfigsDTO, userID: number): Promise<number> {
  try {
    const body = {
        lobbySettings: lobbySettings,
        userID: userID
    }
    const response = await fetch(
      `http://localhost:6969/createLobby`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: createLobby failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    const data: number = (await response.json()).id;
    return data;
  } catch (error) {
    throw error;
  }
}