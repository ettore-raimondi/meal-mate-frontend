import { useCallback, useEffect, useMemo, useState } from "react";
import type { Run, RunEnriched } from "../../../services/run";
import { fetchRuns } from "../../../services/run";
import type { RestaurantEnriched } from "../../../services/restaurant";
import { enrichRuns } from "../utils";

export function useRuns(restaurants: RestaurantEnriched[]): {
  runs: Run[];
  enrichedRuns: RunEnriched[];
  refetch: () => Promise<void>;
} {
  const [runs, setRuns] = useState<Run[]>([]);

  const enrichedRuns = useMemo(() => {
    return enrichRuns(runs, restaurants);
  }, [runs, restaurants]);

  const fetchRunsData = useCallback(async () => {
    const runsData = await fetchRuns();
    setRuns(runsData);
  }, []);

  useEffect(() => {
    fetchRunsData();
  }, [fetchRunsData]);

  return { runs, enrichedRuns, refetch: fetchRunsData };
}
