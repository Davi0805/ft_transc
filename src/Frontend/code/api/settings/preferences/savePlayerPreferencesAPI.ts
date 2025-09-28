import { authService } from "../../../services/authService";
import { PlayerPreferences } from "./PreferenceInterface";


export async function savePlayerPreferences(preferences: PlayerPreferences): Promise<void> {
  try {
    if (!authService.isUserAuthenticated()) {
      const errorMessage: string = `DEBUG: No authToken at savePlayerPreferences`;
      const error: Error = new Error(errorMessage);
      throw error;
    }

    const response = await fetch("/api/user/users/preferences", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorMessage = `savePlayerPreferences failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return; // success
  } catch (error) {
    throw error;
  }
}
