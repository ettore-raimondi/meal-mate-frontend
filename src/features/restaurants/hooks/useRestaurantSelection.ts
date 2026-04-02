import { useMemo } from "react";
import type { RestaurantEnriched } from "../../../services/restaurant";

export const NEW_RESTAURANT_SLUG = "new";

export function useRestaurantSelection(
  restaurantNumber: string | undefined,
  restaurants: RestaurantEnriched[],
  restaurantsNearMe: RestaurantEnriched[],
) {
  const isCreatingRestaurant = restaurantNumber === NEW_RESTAURANT_SLUG;
  const viewingDetail = Boolean(restaurantNumber);
  const restaurantRouteId =
    viewingDetail && !isCreatingRestaurant ? restaurantNumber : undefined;
  const restaurantRouteNumericId =
    restaurantRouteId !== undefined && !Number.isNaN(Number(restaurantRouteId))
      ? Number(restaurantRouteId)
      : undefined;

  const selection = useMemo(() => {
    if (restaurantRouteNumericId === undefined) {
      return { activeRestaurant: undefined, activeRestaurantSource: null };
    }
    const ownedMatch = restaurants.find(
      (restaurant) => restaurant.id === restaurantRouteNumericId,
    );
    if (ownedMatch) {
      return {
        activeRestaurant: ownedMatch,
        activeRestaurantSource: "owned" as const,
      };
    }
    const nearbyMatch = restaurantsNearMe.find(
      (restaurant) => restaurant.id === restaurantRouteNumericId,
    );
    if (nearbyMatch) {
      return {
        activeRestaurant: nearbyMatch,
        activeRestaurantSource: "nearby" as const,
      };
    }
    return { activeRestaurant: undefined, activeRestaurantSource: null };
  }, [restaurantRouteNumericId, restaurants, restaurantsNearMe]);

  return {
    isCreatingRestaurant,
    viewingDetail,
    restaurantRouteId,
    ...selection,
  };
}
