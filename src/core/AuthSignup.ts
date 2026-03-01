// src/core/AuthSignup.ts
import CryptoJS from "crypto-js";

interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Hash the password before sending
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password: encryptedPassword }),
    });

    return response.json();
  } catch (error) {
    return { success: false, message: "Network error during signup" };
  }
};
