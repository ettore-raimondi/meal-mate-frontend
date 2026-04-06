import { mapToEnrichedOrder } from "../../../services/order/order.mapper";
import type { Order, OrderEnriched } from "../../../services/order/order.types";
import type { RestaurantEnriched } from "../../../services/restaurant";
import type { Run } from "../../../services/run";

export function enrichOrders(
  orders: Order[],
  restaurants: RestaurantEnriched[],
  runs: Run[],
): OrderEnriched[] {
  const restaurantMap = new Map<number, RestaurantEnriched>();
  restaurants.forEach((restaurant) => {
    restaurantMap.set(restaurant.id, restaurant);
  });

  const runMap = new Map<number, Run>();
  runs.forEach((run) => {
    runMap.set(run.id, run);
  });

  return orders
    .map((order) => {
      const restaurant = restaurantMap.get(order.restaurantId);
      if (!restaurant) {
        return undefined;
      }

      const run = runMap.get(order.foodRun);
      return mapToEnrichedOrder(order, restaurant, run);
    })
    .filter((order): order is OrderEnriched => order !== undefined);
}
