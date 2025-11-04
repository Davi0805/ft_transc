export interface MatchHistoryEntry {
  id: number;
  gameType: string;
  map: string;
  mode: string;
  result: "won" | "lost";
  date: string;
}