import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order, OrderEnriched } from "../../../services/order/order.types";
import { fetchOrdersForUser } from "../../../services/order/order.service";
import type { RestaurantEnriched } from "../../../services/restaurant";
import type { Run } from "../../../services/run";
import { enrichOrders } from "../utils/enrichment";

export function useOrders(
  restaurants: RestaurantEnriched[],
  runs: Run[],
): {
  orders: Order[];
  enrichedOrders: OrderEnriched[];
  refetch: () => Promise<void>;
} {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchData = useCallback(async () => {
    const ordersData = await fetchOrdersForUser();
    setOrders(ordersData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enrichedOrders = useMemo(() => {
    if (!orders.length || !restaurants.length || !runs.length) {
      return [];
    }
    return enrichOrders(orders, restaurants, runs);
  }, [orders, restaurants, runs]);

  return { orders, enrichedOrders, refetch: fetchData };
}
