import { authService } from "../../services/authService";

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
export async function isUserBlockedByUsername(username: string): Promise<boolean> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at isUserBlockedByUsername`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8080/block/state/${username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: isUserBlockedByUsername failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return (await response.json()).is_blocked as boolean;
  } catch (error) {
    throw error;
  }
}
