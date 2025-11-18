import { UsersData } from "./types/usersDataInterface";
/**
 * @brief
 *
 *
 */
export async function getTopTenData(ids: number[]): Promise<UsersData[]> {
  try {
    const response = await fetch("http://localhost:8080/user/findbyidin/user_ids?user_ids=" + ids.join(","), {
      method: "GET",
    });

    if (!response.ok) {
      const errorMessage: string = `Fetch top ten players failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return (await response.json()) as UsersData[];
  } catch (error) {
    throw error;
  }
}
