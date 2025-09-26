import { authService } from "../../services/authService";

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
export async function getUserAvatarById(userId: number): Promise<string> {
  try {
    if (!authService.getToken()) {
      const errorMessage = `DEBUG: No authToken at getUserAvatarById`;
      const error = new Error(errorMessage);
      throw error;
    }
    const response = await fetch(
      `http://localhost:8080/users/avatar/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = `DEBUG: Error on getUserAvatarById with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    let imgURL: string;
    if (response.status === 204) {
      // default profile picture
      imgURL = "/Assets/default/bobzao.jpg";
    } else {
      const blob = await response.blob();
      imgURL = URL.createObjectURL(blob);
    }
    return imgURL;
  } catch (error) {
    throw error;
  }
}
