import { authService } from "../../services/authService";

export interface FriendRequest {
  sender_id: number;
  request_id: number;
  sender_name: string;
  sender_username: string;
}

/**
 * @brief
 * Fetches all pending friend requests for the authenticated user.
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
export async function getFriendRequests(): Promise<FriendRequest[]> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at getFriendRequests`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `/api/user/friend_requests/pending`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: getFriendRequests failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return (await response.json()) as FriendRequest[];
  } catch (error) {
    throw error;
  }
}
