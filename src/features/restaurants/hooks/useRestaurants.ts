import { useCallback, useEffect, useState } from "react";
import {
  fetchRestaurants,
  type RestaurantEnriched,
} from "../../../services/restaurant";

export function useRestaurants(): {
  restaurants: RestaurantEnriched[];
  enrichedRestaurants: RestaurantEnriched[];
  refetch: () => Promise<void>;
} {
  const [restaurants, setRestaurants] = useState<RestaurantEnriched[]>([]);

  const fetch = useCallback(async () => {
    const restaurantsData = await fetchRestaurants();
    setRestaurants(restaurantsData);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { restaurants, enrichedRestaurants: restaurants, refetch: fetch };
}
