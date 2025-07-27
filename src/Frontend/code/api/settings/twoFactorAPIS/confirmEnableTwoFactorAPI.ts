import { authService } from "../../../services/authService";

export async function confirmTwoFactorCode(code: string): Promise<void> {
  try {
    const response = await fetch(
      "http://localhost:8080/twofa/activate/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({ token: code }),
      }
    );

    if (!response.ok) {
      const errorMessage = `2FA confirmation code failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return; // sucess
  } catch (error) {
    throw error;
  }
}
