export interface MatchHistoryEntry {
  id: number;
  mode: string;
  result: "Won" | "Lost";
  date_time: string;
}