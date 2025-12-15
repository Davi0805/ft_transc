import { authService } from "../../../services/authService";

export interface FriendInfo
{
  user_id: number;
  name: string;
  username: string;
  email: string;
  user_image: string | null;
}

/**
 * @brief
 * Fetches all messages from a specifdic conversation with the given ID.
 *
 * Requires a valid authentication token from authService.
 *
 * Throws an error if the request fails or if no auth token is present.
 *
 * @todo Can be further implemented a logic for error handling
 *
 * @param convID - The unique identifier of the conversation in question.
 * @returns A promise that resolves to an array of messages when processed.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getAllFriends(): Promise<FriendInfo[]> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at getAllFriends`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(`http://localhost:8080/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      const errorMessage: string = `DEBUG: getMessagesByConvID failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return (await response.json()) as FriendInfo[];
  } catch (error) {
    throw error;
  }
}
