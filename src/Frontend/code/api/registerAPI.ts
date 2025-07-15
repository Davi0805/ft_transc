export interface RegisterCredentials {
  name: string | null;
  username: string | null;
  email: string | null;
  password_hash: string | null;
}

/**
 * @brief
 * Sends a registration request to the backend with the provided user credentials.
 * Attempts to create a new user account using the supplied registration data.
 *
 * Throws an error if the registration request fails.
 *
 * @todo Implement more detailed error handling and response parsing.
 *
 * @returns A promise that resolves when the registration is successful.
 * @throws {Error} If the registration API request fails.
 */
export async function register(registerData: RegisterCredentials) {
  try {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorMessage = `DEBUG: Register failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
  } catch (error) {
    throw error;
  }
  return;
}
