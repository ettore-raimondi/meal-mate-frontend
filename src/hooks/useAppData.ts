import { useRestaurants } from "../features/restaurants";
import { useRuns } from "../features/runs/hooks";
import { useOrders } from "../features/orders/hooks/useOrders";

/**
 * Composite hook that fetches all app data efficiently without duplicates.
 * Restaurants are fetched once and passed to runs and orders hooks.
 */
export function useAppData() {
  const restaurantsResult = useRestaurants();
  const runResult = useRuns(restaurantsResult.restaurants);
  const ordersResult = useOrders(restaurantsResult.restaurants, runResult.runs);

  return {
    restaurants: restaurantsResult.restaurants,
    refetchRestaurants: restaurantsResult.refetch,
    runs: runResult.runs,
    enrichedRuns: runResult.enrichedRuns,
    refetchRuns: runResult.refetch,
    orders: ordersResult.orders,
    enrichedOrders: ordersResult.enrichedOrders,
    refetchOrders: ordersResult.refetch,
  };
}
