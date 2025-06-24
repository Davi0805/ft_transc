export async function verifyTwoFactorCode(token, code) {
  try {
    const response = await fetch("http://localhost:8080/twofa/auth", {
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
      error.status = response.status;
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
