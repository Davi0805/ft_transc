/**
 * @brief
 * Blocks the specified user by their username.
 *
 * Requires a valid authentication token from authService.
 *
 * Throws an error if the request fails or if no auth token is present.
 *
 * @todo Can be further implemented a logic for error handling
 *
 * @param username - The username of the user to block.
 * @returns A promise that resolves when the user has been blocked.
 * @throws {Error} If the authentication token is missing or the API request fails.
 *
 */
import { authService } from "../../services/authService";


export async function blockUserByUsername(
  username: string
): Promise<void> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at blockUserByUsername`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
        `http://localhost:8080//friend_requests/${username}/blockbyusername`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: blockUserByUsername failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return;
  } catch (error) {
    throw error;
  }
}
