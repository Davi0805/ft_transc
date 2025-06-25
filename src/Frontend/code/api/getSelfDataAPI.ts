import { authService } from "../services/authService";

export interface SelfData {
  id: number; // userID
  nickname: string | null;
}

/**
 * @brief
 * Fetches the authenticated user's data from the backend.
 *
 * Requires a valid authentication token.
 *
 * Throws an error if the request fails or if no authentication token is present.
 *
 * @todo Implement more robust error handling logic.
 *
 * @returns A promise that resolves to the user's data object.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getSelfData(): Promise<SelfData> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at getSelfData`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch("http://localhost:8080/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (response.status == 401 || response.status == 404) {
      throw new Error("Invalid token");
    }

    if (!response.ok) {
      const errorMessage: string = `Fetch user failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return (await response.json()) as SelfData;
  } catch (error) {
    throw error;
  }
}
