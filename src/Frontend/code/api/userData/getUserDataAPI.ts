export interface UserData {
  user_id: number | string;
  name: string;
  username: string;
  email: string;
  spriteID: number,
  rating: number
}

/**
 * @brief
 * Fetches the user data with the given userID from the backend.
 *
 * Throws an error if the request fails.
 *
 * @todo Implement more robust error handling logic.
 *
 * @returns A promise that resolves to the user's data object.
 * @throws {Error} If the authentication token is missing or the API request fails.
 */
export async function getUserDataById(userID: number): Promise<UserData> {
  try {
    const response = await fetch(`/api/user/users/${userID}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorMessage: string = `DEBUG: getUserDataById failed with status ${response.status}`;
      const error: Error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return await response.json() as UserData;
  } catch (error) {
    throw error;
  }
}
