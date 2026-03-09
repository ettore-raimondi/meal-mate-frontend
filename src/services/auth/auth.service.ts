import { httpClient } from "../http";

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
}): Promise<{ id: string; email: string }> {
  return httpClient("users", {
    method: "POST",
    body: { firstName, lastName, email, password },
  });
}
