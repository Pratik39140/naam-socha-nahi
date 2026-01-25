// src/core/AuthLogin.ts
import CryptoJS from "crypto-js";

interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    if (username === "admin" && encryptedPassword) {
      return { success: true, token: "mock-jwt-token-" + Date.now() };
    }

    return { success: false, message: "Invalid username or password" };
  } catch {
    return { success: false, message: "Server error during authentication" };
  }
};
