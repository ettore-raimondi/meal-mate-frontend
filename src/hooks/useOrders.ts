import { useEffect, useState } from "react";
import type { Order, OrderEnriched } from "../services/order/order.types";
import { fetchOrdersForUser } from "../services/order/order.service";
import type { RestaurantEnriched } from "../services/restaurant";
import { mapToEnrichedOrder } from "../services/order/order.mapper";
import { fetchRuns } from "../services/run";
import type { Run } from "../services/run";
import React from "react";
import { AppContext } from "../context/AppContext";

export function useOrders(): {
  orders: Order[];
  enrichedOrders: OrderEnriched[];
} {
  const { restaurants } = React.useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [enrichedOrders, setEnrichedOrders] = useState<OrderEnriched[]>([]);

  const restaurantMap = new Map<number, RestaurantEnriched>();
  restaurants.forEach((restaurant) => {
    restaurantMap.set(restaurant.id, restaurant);
  });

  function enrichOrders() {
    const runMap = new Map<number, Run>();
    runs.forEach((run) => {
      runMap.set(run.id, run);
    });

    return orders.map((order) => {
      const restaurant = restaurantMap.get(order.restaurantId);
      if (!restaurant) {
        throw new Error(
          `Restaurant with ID ${order.restaurantId} not found for order ${order.id}`,
        );
      }

      const run = runMap.get(order.foodRun);

      return mapToEnrichedOrder(order, restaurant, run);
    });
  }

  async function fetchData() {
    const [ordersData, runsData] = await Promise.all([
      fetchOrdersForUser(),
      fetchRuns(),
    ]);
    setOrders(ordersData);
    setRuns(runsData);
  }

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  useEffect(() => {
    if (orders.length && restaurants.length && runs.length) {
      // Run enrichment whenever orders, restaurants, or runs change, but only if we have data for all
      const enriched = enrichOrders();
      setEnrichedOrders(enriched);
    }
  }, [orders, restaurants, runs]);

  return { orders, enrichedOrders };
}
