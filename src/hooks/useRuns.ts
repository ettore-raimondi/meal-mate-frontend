import { useEffect, useState } from "react";
import type { Run, RunEnriched } from "../services/run";
import { fetchRuns, mapToEnrichedRun } from "../services/run";
import type { Restaurant } from "../services/restaurant";
import React from "react";
import { AppContext } from "../context/AppContext";

export function useRuns(): {
  runs: Run[];
  enrichedRuns: RunEnriched[];
  refreshRuns: () => Promise<void>;
} {
  const { restaurants } = React.useContext(AppContext);
  const [runs, setRuns] = useState<Run[]>([]);

  const restaurantMap = new Map<number, Restaurant>();
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

  async function fetchRunsData() {
    const runsData = await fetchRuns();
    setRuns(runsData);
  }

  useEffect(() => {
    (async () => {
      await fetchRunsData();
    })();
  }, []);

  return { runs, enrichedRuns, refreshRuns: fetchRunsData };
}
