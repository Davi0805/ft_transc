import { authService } from "../../services/authService";
import { getUserDataById } from "./getUserDataByIDAPI";
import { ProfileDataType } from "./types/ProfileDataType";
/**
 * Fetches the avatar image for a specific user.
 *   
 * Requires a valid authentication token from authService.
 * 
 * Throws an error if the request fails or if no auth token is present.
 *
 * @todo Can be further implemented a logic for error handling
 * 
 * @param userId - The unique identifier of the user whose avatar is being requested.
 * @returns A Promise that resolves to the fetch Response object containing the avatar image url.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getProfileUserData(id: number): Promise<ProfileDataType> {
  try {
    if (!authService.getToken()) {
      const errorMessage = `DEBUG: No authToken at getProfileUserData`;
      const error = new Error(errorMessage);
      throw error;
    }

    // flex tape right here dont me mid lol
    const { username } = await getUserDataById(id);
    
    const response = await fetch(`http://localhost:8080/profile/${username}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authService.getToken()}`,
      },
      });

      if (!response.ok) {
        const errorMessage: string = `DEBUG: getProfileUserData failed with status ${response.status}`;
        const error: Error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }
      return await response.json() as ProfileDataType;
  } catch (error) {
    throw error;
  }
}
