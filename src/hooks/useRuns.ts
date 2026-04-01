import { useCallback, useEffect, useState } from "react";
import { fetchRuns } from "../services/run/run.service";
import type { Run } from "../services/run/run.types";

export function useRuns() {
  const [runs, setRuns] = useState<Run[]>([]);

  const loadRunsAndRestaurants = useCallback(async () => {
    const runsResponse = await fetchRuns();
    setRuns(runsResponse);
    // We can choose to set restaurants in context here if needed
  }, []);

  useEffect(() => {
    loadRunsAndRestaurants();
  }, [loadRunsAndRestaurants]);

  return { runs };
}
