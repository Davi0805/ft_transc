import { authService } from "../../services/authService";

export async function updateName(newName: string): Promise<void> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at updateName`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch("/api/user/users/name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify({ name: newName }),
    });

    if (!response.ok) {
      const errorMessage = `UpdateName failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return; // success
  } catch (error) {
    throw error;
  }
}
