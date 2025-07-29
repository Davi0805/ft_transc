import { authService } from "../../services/authService";

/**
 * @brief
 * Fetches the count of pending friend requests for the authenticated user.
 *
 * Requires a valid authentication token from authService.
 *
 * Throws an error if the request fails or if no auth token is present.
 *
 * @todo Can be further implemented a logic for error handling
 *
 * @returns A promise that resolves to the number of pending friend requests.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getFriendRequestsCount(): Promise<number> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at getFriendRequestsCount`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8080/friend_requests/pending`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: getFriendRequestsCount failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return parseInt((await response.json()).pendingRequestsCounter) as number;
  } catch (error) {
    throw error;
  }
}
