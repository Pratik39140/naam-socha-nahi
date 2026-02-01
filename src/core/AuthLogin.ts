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
      const token = "mock-jwt-token-" + Date.now();
      // store mock session (demo)
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", "admin");

      return { success: true, token };
    }

    return { success: false, message: "Invalid username or password" };
  } catch {
    return { success: false, message: "Server error during authentication" };
  }
};
