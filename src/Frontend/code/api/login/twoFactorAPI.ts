export async function verifyTwoFactorCode(token: string, code: string): Promise<void> {
  try {
    const response = await fetch("/api/user/twofa/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token: code }),
    });

    if (!response.ok) {
      const errorMessage = `2FA code failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }
    return; // sucess
  } catch (error) {
    throw error;
  }
}
