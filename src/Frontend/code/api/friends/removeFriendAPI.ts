import { authService } from "../../services/authService";

/**
 * Removes a friend by their user ID.
 * Calls DELETE /friends/remove/:id with the auth token.
 * Throws on non-OK response.
 */
export async function removeFriend(friendID: number): Promise<void> {
  if (!authService.isUserAuthenticated()) {
    throw new Error("DEBUG: No authToken at removeFriend");
  }

  const response = await fetch(
    `http://localhost:8080/friends/remove/${friendID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      `DEBUG: removeFriend failed with status ${response.status}`
    );
    (error as any).status = response.status;
    throw error;
  }
}
