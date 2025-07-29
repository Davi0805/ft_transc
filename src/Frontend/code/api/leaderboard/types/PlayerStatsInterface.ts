export interface PlayerStats {
  id: number; // userID
  username: string;
  rank?: number; // Rank of the player in the leaderboar
  wins: number;
  losses: number;
  points: number; // Points of the player in the leaderboard
}
