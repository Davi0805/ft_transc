export interface LoginState {
  token: string;
  verified: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * @brief
 * Sends a login request to the backend with the provided user credentials and
 * attempts to authenticate the user by posting their credentials to the login endpoint.
 * 
 * Throws an error if the login fails or the server responds with a non-OK status.
 *
 * @todo Improve error handling and provide more detailed error messages.
 *
 * @param userData The user's login credentials.
 * @returns A promise that resolves to the login state object upon successful authentication.
 * @throws {Error} If the login request fails or the server returns an error status.
 */
export async function login(userData: LoginCredentials): Promise<LoginState> {
  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorMessage = `DEBUG: Login failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return (await response.json()) as LoginState;
  } catch (error) {
    throw error;
  }
}
