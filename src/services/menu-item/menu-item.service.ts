import type { MenuItem } from ".";
import { httpClient } from "../http";

export async function scrapeMenuItems(
  restaurantId: string,
): Promise<MenuItem[]> {
  return httpClient("scrape/menu-items/", {
    method: "GET",
    params: {
      restaurant_id: restaurantId,
    },
  });
}
