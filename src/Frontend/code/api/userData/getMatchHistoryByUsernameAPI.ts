import { authService } from "../../services/authService";
import { MatchHistoryEntry } from "./types/MatchHistoryType";

/** 
 * @brief Fetches the last 5 matches from history for a specific user by their id. 
 * 
 * Requires a valid authentication token from authService.
 * 
 * 
 * @todo Can be further implemented a logic for error handling
 * 
 * @param id - The id of the user whose match history is being requested.
 * @returns A Promise that resolves to an array of MatchHistoryEntry objects.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getMatchHistoryById(id: number): Promise<MatchHistoryEntry[]> {
  try {
    if (!authService.getToken()) {
      const errorMessage = `DEBUG: No authToken at getMatchHistoryById`;
      const error = new Error(errorMessage);
      throw error;
    }
    const response = await fetch(`http://localhost:8084/stats/history/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authService.getToken()}`,
      },
      });

      if (!response.ok) {
        const errorMessage: string = `DEBUG: getMatchHistoryById failed with status ${response.status}`;
        const error: Error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }
      return await response.json() as MatchHistoryEntry[];
  } catch (error) {
    throw error;
  }
}
