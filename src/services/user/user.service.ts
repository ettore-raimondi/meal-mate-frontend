import { httpClient } from "../http/http";
import { mapToUser } from "./user.mapper";
import type { User } from "./user.types";

const SERVICE_ENDPOINT = "users/:id/";

export async function getUser({ id }: { id: number }): Promise<User> {
  const userDto = await httpClient(SERVICE_ENDPOINT, {
    method: "GET",
    urlParams: {
      id: id.toString(),
    },
  });

  return mapToUser(userDto);
}
