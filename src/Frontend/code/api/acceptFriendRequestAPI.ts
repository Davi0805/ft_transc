import { authService } from "../services/authService";

export async function acceptFriendRequest(reqID: number): Promise<void> {
  try {
    if (!authService.authToken) {
      const errorMessage: string = `DEBUG: No authToken at acceptFriendRequest`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8080/friend_requests/${reqID}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.authToken}`,
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
