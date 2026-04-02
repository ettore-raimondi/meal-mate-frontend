import { useState, useEffect } from "react";
import {
  fetchRestaurants,
  type RestaurantEnriched,
} from "../services/restaurant";

export function useRestaurants(): {
  restaurants: RestaurantEnriched[];
  enrichedRestaurants: RestaurantEnriched[];
} {
  const [restaurants, setRestaurants] = useState<RestaurantEnriched[]>([]);

  async function fetch() {
    const restaurantsData = await fetchRestaurants();
    setRestaurants(restaurantsData);
  }

  useEffect(() => {
    (async () => {
      await fetch();
    })();
  }, []);

  return { restaurants, enrichedRestaurants: restaurants };
}
