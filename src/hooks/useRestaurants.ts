import { useState, useEffect } from "react";
import {
  fetchRestaurants,
  type Restaurant,
  type RestaurantEnriched,
} from "../services/restaurant";

export function useRestaurants(): {
  restaurants: Restaurant[];
  enrichedRestaurants: RestaurantEnriched[];
} {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const enrichedRestaurants: RestaurantEnriched[] = restaurants;

  async function fetch() {
    const restaurantsData = await fetchRestaurants();
    setRestaurants(restaurantsData);
  }

  useEffect(() => {
    (async () => {
      await fetch();
    })();
  }, []);

  return { restaurants, enrichedRestaurants };
}
