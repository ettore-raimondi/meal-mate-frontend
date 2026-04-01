import type { Restaurant } from "../restaurant";
import type { OrderResponse, Order, OrderEnriched } from "./order.types";
import { formatHumanDateTime } from "../../helpers/date";

export function mapToOrder(orderDTO: OrderResponse): Order {
  return {
    id: orderDTO.id,
    total: orderDTO.total,
    user: orderDTO.user,
    foodRun: orderDTO.food_run,
    menuItems: orderDTO.menu_items,
    note: orderDTO.note,
    status: orderDTO.status,
    restaurantId: orderDTO.restaurant_id,
    createdAt: new Date(orderDTO.created_at),
    deletedAt: orderDTO.deleted_at ? new Date(orderDTO.deleted_at) : undefined,
  };
}

export function mapToEnrichedOrder(
  order: Order,
  restaurant: Restaurant,
): OrderEnriched {
  return {
    ...order,
    createdAtFormatted: formatHumanDateTime(order.createdAt),
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
    },
    menuItems: restaurant.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price).toFixed(2), // Ensure price is a string with 2 decimal places
    })),
  };
}
