import { useEffect, useState } from "react";
import type { Order, OrderEnriched } from "../services/order/order.types";
import { fetchOrdersForUser } from "../services/order/order.service";
import type { Restaurant } from "../services/restaurant";
import { mapToEnrichedOrder } from "../services/order/order.mapper";
import React from "react";
import { AppContext } from "../context/AppContext";

export function useOrders(): {
  orders: Order[];
  enrichedOrders: OrderEnriched[];
} {
  const { restaurants } = React.useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enrichedOrders, setEnrichedOrders] = useState<OrderEnriched[]>([]);

  const restaurantMap = new Map<number, Restaurant>();
  restaurants.forEach((restaurant) => {
    restaurantMap.set(restaurant.id, restaurant);
  });

  function enrichOrders() {
    return orders.map((order) => {
      const restaurant = restaurantMap.get(order.restaurantId);
      if (!restaurant) {
        throw new Error(
          `Restaurant with ID ${order.restaurantId} not found for order ${order.id}`,
        );
      }

      return mapToEnrichedOrder(order, restaurant);
    });
  }

  async function fetchOrders() {
    const orders = await fetchOrdersForUser();
    setOrders(orders);
  }

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, []);

  useEffect(() => {
    if (orders.length && restaurants.length) {
      // Run enrichment whenever orders or restaurants change, but only if we have data for both
      const enriched = enrichOrders();
      setEnrichedOrders(enriched);
    }
  }, [orders, restaurants]);

  return { orders, enrichedOrders };
}
