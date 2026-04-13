import { getDecodedToken } from "../auth/auth.service";
import { httpClient } from "../http";
import type { Order } from "./order.types";
import { mapToOrder } from "./order.mapper";

export async function createOrder({
  foodRun,
  menuItems,
  note,
}: {
  foodRun: number;
  menuItems: number[];
  note?: string;
}): Promise<Order> {
  const userId = getDecodedToken()?.user_id;
  const orderDTO = await httpClient("orders/", {
    method: "POST",
    body: {
      food_run: foodRun,
      menu_items: menuItems,
      user: userId,
      note,
    },
  });

  return mapToOrder(orderDTO);
}

export async function updateOrder({
  orderId,
  menuItems,
  note,
}: {
  orderId: number;
  menuItems: number[];
  note?: string;
}): Promise<Order> {
  const orderDTO = await httpClient("orders/:id/", {
    method: "PATCH",
    urlParams: { id: orderId.toString() },
    body: {
      menu_items: menuItems,
      note,
    },
  });

  return mapToOrder(orderDTO);
}

export async function fetchOrdersForUser(): Promise<Order[]> {
  const ordersDTO = await httpClient("orders/", {
    method: "GET",
  });

  return ordersDTO.map(mapToOrder);
}

export async function fetchOrderById(orderId: number): Promise<Order> {
  const orderDTO = await httpClient("orders/:id/", {
    method: "GET",
    urlParams: { id: orderId.toString() },
  });

  return mapToOrder(orderDTO);
}

export async function fetchLatestOrderForRun(
  foodRunId: number,
): Promise<Order | null> {
  const ordersDTO = await httpClient("orders/latest/:foodRunId/", {
    method: "GET",
    urlParams: { foodRunId: foodRunId.toString() },
  });

  if (!ordersDTO) {
    return null; // No order found for this run
  }

  return mapToOrder(ordersDTO);
}

export async function fetchOrdersForRun(foodRunId: number): Promise<Order[]> {
  const ordersDTO = await httpClient("orders/run/:foodRunId/", {
    method: "GET",
    urlParams: { foodRunId: foodRunId.toString() },
  });

  return ordersDTO.map(mapToOrder);
}
