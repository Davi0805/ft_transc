import { authService } from "../services/authService";

export interface Conversation {
  id: number; // conversation id
  user1_id: number;
  user2_id: number;
  unread_count: number;
}

/**
 * @brief
 * Fetches all conversations associated with the authenticated user.
 *
 * Requires a valid authentication token from authService.
 *
 * Throws an error if the request fails or if no auth token is present.
 *
 * @todo Can be further implemented a logic for error handling
 *
 * @returns A promise that resolves to an array of Conversation objects.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getSelfConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch("http://localhost:8081/conversations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authService.authToken}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `DEBUG: getSelfConversations failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return (await response.json()) as Conversation[];
  } catch (error) {
    throw error;
  }
}
