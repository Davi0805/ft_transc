import { authService } from "../../services/authService";

export async function uploadAvatar(file: File | undefined): Promise<void> {
  try {
    if (!file) {
      const errorMessage = `DEBUG: Upload file not defined`;
      const error = new Error(errorMessage);
      throw error;
    }
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at updatePassword`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/user/users/upload-avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = `uploadAvatar failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return; // success
  } catch (error) {
    throw error;
  }
}
