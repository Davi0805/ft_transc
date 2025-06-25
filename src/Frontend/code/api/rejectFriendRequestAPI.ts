import { authService } from "../services/authService";

export async function rejectFriendRequest( friendRequestID: number): Promise<void> {
  try {
    if (!authService.isAuthenticated) {
      const errorMessage: string = `DEBUG: No authToken at rejectFriendRequest`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch(
      `http://localhost:8080/friend_requests/${friendRequestID}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage: string = `rejectFriendRequest failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return;
  } catch (error) {
    throw error;
  }
}
