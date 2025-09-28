import { authService } from "../../../services/authService";

export async function enableTwoFactor(): Promise<string> {
  try {
    const response = await fetch("/api/user/twofa/activate", {
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

    const data = await response.json();
    return data.qrcode;
  } catch (error) {
    throw error;
  }
}
