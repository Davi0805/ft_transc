import { SelfData } from "../api/getSelfDataAPI";
import { LobbiesListDTO, LobbyCreationConfigsDTO, TLobby } from "../pages/play/lobbyTyping";

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

export async function enterLobby(lobbyID: number, selfData: {
  id: number, username: string | null
}): Promise<TLobby> {
  try {
    const body = selfData
    const response = await fetch(
      `http://localhost:6969/enterLobby/${lobbyID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: enterLobby failed with status ${response.status}`;
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

export async function createLobby(lobbySettings: LobbyCreationConfigsDTO, selfData: {
    id: number, username: string | null
}): Promise<TLobby> {
  try {
    const body = {
        lobbySettings: lobbySettings,
        selfData: selfData
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

    const data = (await response.json()) as TLobby;
    return data;
  } catch (error) {
    throw error;
  }
}