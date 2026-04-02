import type { Restaurant } from "../restaurant";
import type { OrderResponse, Order, OrderEnriched } from "./order.types";
import type { Run } from "../run";
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
  run?: Run,
): OrderEnriched {
  return {
    ...order,
    createdAtFormatted: formatHumanDateTime(order.createdAt),
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      phoneNumber: restaurant.phoneNumber,
    },
    run: run
      ? {
          id: run.id,
          name: run.name,
          deadlineFormatted: formatHumanDateTime(run.deadline),
          status: run.status,
        }
      : undefined,
    // Maps the menu item IDs in the order to their corresponding details from the restaurant's menu
    menuItems: order.menuItems.map((menuItemId) => {
      const item = restaurant.menuItems.find((m) => m.id === menuItemId);
      if (!item) {
        throw new Error(
          `Menu item with ID ${menuItemId} not found in restaurant ${restaurant.id}`,
        );
      }
      return {
        id: item.id,
        name: item.name,
        price: Number(item.price).toFixed(2), // Ensure price is a string with 2 decimal places
      };
    }),
  };
}
