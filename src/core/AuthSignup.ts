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
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    if (username && email && encryptedPassword) {
      return { success: true, token: "mock-registration-token-" + Date.now() };
    }

    return { success: false, message: "Invalid registration details" };
  } catch {
    return { success: false, message: "Server error during registration" };
  }
};
