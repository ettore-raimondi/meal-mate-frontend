import { useCallback, useEffect, useState } from "react";
import type { Run, RunEnriched } from "../../../services/run";
import { fetchRuns, mapToEnrichedRun } from "../../../services/run";
import type { RestaurantEnriched } from "../../../services/restaurant";
import React from "react";
import { AppContext } from "../../../context/AppContext";

export function useRuns(): {
  runs: Run[];
  enrichedRuns: RunEnriched[];
  refetch: () => Promise<void>;
} {
  const { restaurants } = React.useContext(AppContext);
  const [runs, setRuns] = useState<Run[]>([]);

  const restaurantMap = new Map<number, RestaurantEnriched>();
  restaurants.forEach((restaurant) => {
    restaurantMap.set(restaurant.id, restaurant);
  });

  const enrichedRuns = runs.map((run) => {
    const restaurant = restaurantMap.get(run.restaurantId);
    if (!restaurant) {
      console.warn(
        `Restaurant with ID ${run.restaurantId} not found for run ${run.id}`,
      );
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

  const fetchRunsData = useCallback(async () => {
    const runsData = await fetchRuns();
    setRuns(runsData);
  }, []);

  useEffect(() => {
    fetchRunsData();
  }, [fetchRunsData]);

  return { runs, enrichedRuns, refetch: fetchRunsData };
}
