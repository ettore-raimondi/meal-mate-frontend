import { httpClient } from "../http/http";

const SERVICE_ENDPOINT = "users/:id/";

export async function getUser({ id }: { id: number }) {
  return await httpClient(SERVICE_ENDPOINT, {
    method: "GET",
    urlParams: {
      id: id.toString(),
    },
  });
}
