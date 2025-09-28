import { authService } from "../../../services/authService";

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
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at getSelfConversations`;
      const error: Error = new Error(errorMessage);
      throw error;
    }
    const response = await fetch("/api/chat/conversations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      const errorMessage: string = `DEBUG: getSelfConversations failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return (await response.json()) as Conversation[];
  } catch (error) {
    throw error;
  }
}
