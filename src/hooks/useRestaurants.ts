import { useState, useEffect } from "react";
import { fetchRestaurants, type Restaurant } from "../services/restaurant";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  async function fetch() {
    const restaurants = await fetchRestaurants();
    setRestaurants(restaurants);
  }

  useEffect(() => {
    (async () => {
      await fetch();
    })();
  }, []);

  return restaurants;
}
