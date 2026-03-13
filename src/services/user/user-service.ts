import { httpClient } from "../http/http";

const SERVICE_ENDPOINT = "users";

export async function getUser({ id }: { id: number }) {
  return await httpClient(`${SERVICE_ENDPOINT}/${id}`, {
    method: "GET",
  });
}
