import { authService } from "../../services/authService";

export async function updatePassword(oldPass: string, newPass: string): Promise<void> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at updatePassword`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch("http://localhost:8080/user/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify({ "old_password": oldPass, "password": newPass }),
    });

    if (!response.ok) {
      const errorMessage = `updatePassword failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return; // success
  } catch (error) {
    throw error;
  }
}
