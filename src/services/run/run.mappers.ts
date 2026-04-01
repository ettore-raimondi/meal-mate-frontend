import type { Run, RunResponse } from "./run.api";

export function mapRunResponseToRuns(runResponse: RunResponse[]): Run[] {
  return runResponse.map((response) => ({
    id: response.id,
    name: response.name,
    restaurantId: response.restaurant,
    deadline: new Date(response.deadline),
    description: response.description,
    organizerId: response.organizer,
    organizerName: response.organizer_name,
    status: response.status,
    createdAt: response.created_at ? new Date(response.created_at) : undefined,
    updatedAt: response.updated_at ? new Date(response.updated_at) : undefined,
  }));
}
