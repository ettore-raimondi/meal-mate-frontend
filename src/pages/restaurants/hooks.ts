import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Restaurant } from "../homeTypes";

export type RestaurantCollection = "owned" | "nearby";

export const NEW_RESTAURANT_SLUG = "new";

export function useRestaurantSelection(
  restaurantNumber: string | undefined,
  restaurants: Restaurant[],
  restaurantsNearMe: Restaurant[],
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

export function useRestaurantCollections(
  setRestaurants: Dispatch<SetStateAction<Restaurant[]>>,
  setRestaurantsNearMe: Dispatch<SetStateAction<Restaurant[]>>,
) {
  const mutate = useCallback(
    (
      collection: RestaurantCollection,
      mutator: (list: Restaurant[]) => Restaurant[],
    ) => {
      const setter =
        collection === "owned" ? setRestaurants : setRestaurantsNearMe;
      setter((prev) => mutator(prev));
    },
    [setRestaurants, setRestaurantsNearMe],
  );

  const addRestaurantToCollection = useCallback(
    (
      collection: RestaurantCollection,
      restaurant: Restaurant,
      options: { prepend?: boolean } = {},
    ) => {
      const { prepend = true } = options;
      mutate(collection, (list) =>
        prepend ? [restaurant, ...list] : [...list, restaurant],
      );
    },
    [mutate],
  );

  const updateRestaurantInCollection = useCallback(
    (
      collection: RestaurantCollection,
      restaurantId: number,
      updater: (restaurant: Restaurant) => Restaurant,
    ) => {
      mutate(collection, (list) =>
        list.map((restaurant) =>
          restaurant.id === restaurantId ? updater(restaurant) : restaurant,
        ),
      );
    },
    [mutate],
  );

  const removeRestaurantFromCollection = useCallback(
    (collection: RestaurantCollection, restaurantId: number) => {
      mutate(collection, (list) =>
        list.filter((restaurant) => restaurant.id !== restaurantId),
      );
    },
    [mutate],
  );

  return {
    addRestaurantToCollection,
    updateRestaurantInCollection,
    removeRestaurantFromCollection,
  };
}
