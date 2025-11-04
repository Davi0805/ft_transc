import { PlayerStatistics } from "./types/PlayerStatisticsType";
import { authService } from "../../services/authService";

/**
 * @brief Fetch user statistics by username.
 *
 *
 * @todo Implement more robust error handling logic.
 *
 * @returns A Promise that resolves to the PlayerStatistics object.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getStatisticsByUsername(username: string): Promise<PlayerStatistics> {
  if (!authService.getToken()) {
    const errorMessage = `DEBUG: No authToken at getStatisticsByUsername`;
    const error = new Error(errorMessage);
    throw error;
  }

  try {
    const response = await fetch(`http://localhost:8080/stats/${username}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorMessage: string = `DEBUG: getStatisticsByUsername failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return await response.json() as PlayerStatistics;
  } catch (error) {
    throw error;
  }
}
