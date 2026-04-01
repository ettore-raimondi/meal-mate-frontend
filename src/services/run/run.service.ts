import { getDecodedToken } from "../auth";
import { httpClient } from "../http";
import type { CreateRunPayload } from "./run.api";
import { mapRunResponseToRuns } from "./run.mappers";

export async function createRun({
  name,
  description,
  restaurant_id,
  deadline,
  status,
}: CreateRunPayload) {
  const token = getDecodedToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const createdRun = await httpClient("food_runs/", {
    method: "POST",
    body: {
      name,
      description,
      restaurant: restaurant_id,
      organizer: token.user_id,
      deadline,
      status: "OPEN",
    },
  });
  return mapRunResponseToRuns([createdRun])[0];
}

export async function fetchRuns() {
  const runs = await httpClient("food_runs/", {
    method: "GET",
  });
  return mapRunResponseToRuns(runs);
}
