import { useCallback, useEffect, useState } from "react";
import { fetchRestaurantsNearMe } from "../../../services/restaurant/restaurant.service";
import { fetchCoordinates } from "../../../helpers/get-coordinates";
import type { RestaurantEnriched } from "../../../services/restaurant";

export function useNearbyRestaurants(): {
  restaurants: RestaurantEnriched[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [restaurants, setRestaurants] = useState<RestaurantEnriched[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearby = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coordinates = await fetchCoordinates();
      if (!coordinates) {
        setError("Unable to get your location.");
        setRestaurants([]);
        return;
      }
      const nearbyRestaurants = await fetchRestaurantsNearMe(
        coordinates.latitude,
        coordinates.longitude,
      );
      setRestaurants(nearbyRestaurants);
    } catch (err) {
      console.error("Failed to fetch nearby restaurants:", err);
      setError("Failed to load nearby restaurants.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  return { restaurants, isLoading, error, refetch: fetchNearby };
}
