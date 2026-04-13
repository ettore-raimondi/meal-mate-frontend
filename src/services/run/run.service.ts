import { getDecodedToken } from "../auth";
import { httpClient } from "../http";
import type { CreateRunPayload } from "./run.types";
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
      restaurant: restaurant_id.toString(),
      organizer: token.user_id,
      deadline,
      status,
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

export async function updateRun(
  runId: number,
  { name, description, restaurant_id, deadline, status }: CreateRunPayload,
) {
  const updatedRun = await httpClient("food_runs/:id/", {
    method: "PATCH",
    urlParams: { id: runId.toString() },
    body: {
      name,
      description,
      restaurant: restaurant_id,
      deadline,
      status,
    },
  });

  return mapRunResponseToRuns([updatedRun])[0];
}

export async function completeRun(runId: number) {
  const updatedRun = await httpClient("food_runs/:id/", {
    method: "PATCH",
    urlParams: { id: runId.toString() },
    body: { status: "COMPLETED" },
  });

  return mapRunResponseToRuns([updatedRun])[0];
}
