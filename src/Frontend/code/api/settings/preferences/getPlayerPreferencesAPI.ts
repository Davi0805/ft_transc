import { authService } from "../../../services/authService";
import { PlayerPreferences } from "./PreferenceInterface";

/**
 * @brief
 * Fetches the authenticated user's preferences from the backend.
 *
 * Requires a valid authentication token.
 *
 * @todo Implement more robust error handling logic.
 *
 * @returns A promise that resolves to the user's preferences object.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getPlayerPreferences(): Promise<PlayerPreferences> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at getPlayerPreferences`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch("/api/user/user/preferences", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      const errorMessage: string = `Fetch user preferences failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return (await response.json()) as PlayerPreferences;
  } catch (error) {
    throw error;
  }
}
