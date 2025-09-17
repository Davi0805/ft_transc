import { authService } from "../../services/authService";

export interface BlockedStatus {
  "id": number; // todo check what id is this
  "from_user_id": number; // the user who blocked
  "blocked_user_id": number; // the blocked user
}

/**
 * @brief
 * Fetches all blocked users for the authenticated user.
 *
 * Requires a valid authentication token from authService.
 *
 * Throws an error if the request fails or if no auth token is present.
 *
 * @todo Can be further implemented a logic for error handling
 *
 * @returns A promise that resolves to an array of FriendRequest objects.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getBlockedUsers(): Promise<BlockedStatus[]> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at getBlockedUsers`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8080/friend_requests/blocked`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: getBlockedUsers failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return (await response.json()) as BlockedStatus[];
  } catch (error) {
    throw error;
  }
}
