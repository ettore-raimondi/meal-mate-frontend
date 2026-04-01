import { httpClient } from "../http/http";
import type { AuthResponseDTO } from "./auth.mapper";

export function getDecodedToken(): {
  exp: number;
  iat: number;
  user_id: number;
  jti: string;
  token_type: string;
} | null {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ access: string; refresh: string }> {
  // TODO: validate email and password before sending request
  return httpClient("token/", {
    method: "POST",
    body: { email, password },
  });
}

export async function signup({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResponseDTO> {
  return httpClient("users/", {
    method: "POST",
    body: { firstName, lastName, email, password },
  });
}

export function getAccessTokenWithRefreshToken(): Promise<AuthResponseDTO> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token found"));
  }

  return httpClient("token/refresh/", {
    method: "POST",
    body: { refresh: refreshToken },
  });
}
