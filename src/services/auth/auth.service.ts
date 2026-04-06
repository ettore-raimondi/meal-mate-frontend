import { httpClient } from "../http/http";
import type { AuthResponseDTO } from "./auth.mapper";

export function getDecodedToken(): {
  exp: number;
  iat: number;
  user_id: number;
  jti: string;
  token_type: string;
} {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found, is the user authenticated?");
  }

  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    throw new Error("Failed to decode token");
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

export async function getAccessTokenWithRefreshToken(): Promise<AuthResponseDTO> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token found"));
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("No api url provided, check your env file");
  }

  // Use raw fetch to avoid infinite recursion with httpClient
  const response = await fetch(`${apiUrl}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed with status ${response.status}`);
  }

  return response.json() as Promise<AuthResponseDTO>;
}
