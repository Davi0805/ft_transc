

import { authService } from "../services/authService";


export async function enableTwoFactor(token: string, code: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:8080/twofa/activate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      const errorMessage = `2FA code failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}
