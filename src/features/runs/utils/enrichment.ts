import type { RestaurantEnriched } from "../../../services/restaurant";
import type { Run, RunEnriched } from "../../../services/run";
import { mapToEnrichedRun } from "../../../services/run";

export function enrichRuns(
  runs: Run[],
  restaurants: RestaurantEnriched[],
): RunEnriched[] {
  const restaurantMap = new Map<number, RestaurantEnriched>();
  restaurants.forEach((restaurant) => {
    restaurantMap.set(restaurant.id, restaurant);
  });

  return runs.map((run) => {
    const restaurant = restaurantMap.get(run.restaurantId);
    if (!restaurant) {
      return {
        ...run,
        restaurant: {
          id: run.restaurantId,
          name: "Unknown Restaurant",
        },
      } as RunEnriched;
    }

    return mapToEnrichedRun(run, restaurant);
  });
}
