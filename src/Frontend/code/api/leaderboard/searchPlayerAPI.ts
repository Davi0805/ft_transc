import { PlayerStats } from "./types/PlayerStatsInterface";
/**
 * @brief
 *
 *
 */
export async function searchPlayer(username: string): Promise<PlayerStats> {
  try {
    const response = await fetch("http://localhost:8080/", { // todo Change endpoint
      method: "GET",
    });

    if (!response.ok) {
      const errorMessage: string = `Fetch player failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return (await response.json()) as PlayerStats;
  } catch (error) {
    throw error;
  }
}
