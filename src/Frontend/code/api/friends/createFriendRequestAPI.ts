import { authService } from "../../services/authService";

/**
 * @brief
 * Sends a friend request to the specified user by username.
 *
 * Requires a valid authentication token from authService.
 *
 * Throws an error if the request fails or if no auth token is present.
 *
 * @todo Can be further implemented a logic for error handling
 *
 * @param username - The username of the user to send a friend request to.
 * @returns A promise that resolves when the friend request has been created.
 * @throws {Error} If the authentication token is missing or the API request fails.
 *
 */
export async function createFriendRequestByUsername(
  username: string
): Promise<void> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at acceptFriendRequest`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `/api/user/friend_requests/add/${username}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: createFriendRequestByUsername failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return;
  } catch (error) {
    throw error;
  }
}
