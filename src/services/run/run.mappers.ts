import type { Run, RunResponse, RunEnriched } from "./run.types";
import type { Restaurant } from "../restaurant";

export function mapRunResponseToRuns(runResponse: RunResponse[]): Run[] {
  return runResponse.map((response) => ({
    id: response.id,
    name: response.name,
    restaurantId: response.restaurant,
    deadline: new Date(response.deadline),
    description: response.description,
    organizerId: Number(response.organizer),
    organizerName: response.organizer_name,
    status: response.status,
    createdAt: response.created_at ? new Date(response.created_at) : undefined,
    updatedAt: response.updated_at ? new Date(response.updated_at) : undefined,
  }));
}

export function mapToEnrichedRun(
  run: Run,
  restaurant: Restaurant,
): RunEnriched {
  return {
    id: run.id,
    name: run.name,
    deadline: run.deadline,
    description: run.description,
    status: run.status,
    organizerId: run.organizerId,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    organizerName: run.organizerName,
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
    },
  };
}
