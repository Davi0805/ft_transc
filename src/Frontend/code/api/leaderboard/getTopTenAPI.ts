export interface PlayerStats {
  id: number; // userID
  username: string;
  rank?: number; // Rank of the player in the leaderboar
  wins: number;
  losses: number;
  points: number; // Points of the player in the leaderboard
}

/**
 * @brief
 *
 *
 */
export async function getTopTen(): Promise<PlayerStats[]> {
  try {
    const response = await fetch("http://localhost:8080/", { // todo Change endpoint
      method: "GET",
    });

    if (!response.ok) {
      const errorMessage: string = `Fetch top ten players failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return (await response.json()) as PlayerStats[];
  } catch (error) {
    throw error;
  }
}
