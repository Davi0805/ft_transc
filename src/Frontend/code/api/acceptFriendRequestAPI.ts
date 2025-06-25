import { authService } from "../services/authService";

/**
 * @brief 
 * Accepts the friend request by for the specified request ID.
 * 
 * Requires a valid authentication token from authService.
 * 
 * Throws an error if the request fails or if no auth token is present.
 * 
 * @todo Can be further implemented a logic for error handling
 * 
 * @param reqID - The unique identifier of the friend request to accept.
 * @returns A promise that resolves when the friend request has been accepted.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function acceptFriendRequest(reqID: number): Promise<void> {
  try {
    if (!authService.isAuthenticated) {
      const errorMessage: string = `DEBUG: No authToken at acceptFriendRequest`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8080/friend_requests/${reqID}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `DEBUG: acceptFriendRequest failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return;
  } catch (error) {
    throw error;
  }
}
