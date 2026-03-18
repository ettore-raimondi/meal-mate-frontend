import type { MenuItem } from ".";
import type { MenuItemResponse } from "./menu-item.api";
import { httpClient } from "../http";
import { mapToMenuItems } from "./menu-item.mapper";

const toCreatePayload = ({ clientState, id, ...rest }: MenuItem) => rest;

const toUpdatePayload = ({ clientState, imageUrl, ...item }: MenuItem) => ({
  ...item,
  id: Number(item.id),
  image_url: imageUrl,
});

export async function scrapeMenuItems(websiteUrl: string): Promise<MenuItem[]> {
  // TODO: validate websiteUrl before sending request
  return httpClient("menu_items/scrape/", {
    method: "GET",
    params: {
      restaurant_website_url: websiteUrl,
    },
  });
}

export async function getMenuItemsForRestaurant(
  restaurantId: string,
): Promise<MenuItem[]> {
  return httpClient(`menu_items/restaurant/:restaurantId/`, {
    method: "GET",
    urlParams: {
      restaurantId,
    },
  });
}

export async function saveMenuItems(
  restaurantId: string,
  menuItems: MenuItem[],
) {
  const menuItemsDTO = await httpClient("menu_items/bulk_create/", {
    method: "POST",
    body: {
      menu_items: menuItems.map(toCreatePayload),
      restaurant_id: restaurantId,
    },
  });
  return mapToMenuItems(menuItemsDTO);
}

export async function updateMenuItems(
  restaurantId: string,
  menuItems: MenuItem[],
) {
  if (menuItems.length === 0) {
    return [];
  }

  const itemsToCreate = menuItems.filter((item) => item.clientState === "new");
  const itemsToUpdate = menuItems.filter(
    (item) => item.clientState === "toUpdate",
  );
  const unchanged = menuItems.filter((item) => !item.clientState);

  if (itemsToCreate.length === 0 && itemsToUpdate.length === 0) {
    return menuItems;
  }

  const [createdDtos, updatedDtos] = await Promise.all([
    itemsToCreate.length > 0
      ? httpClient("menu_items/bulk_create/", {
          method: "POST",
          body: {
            menu_items: itemsToCreate.map(toCreatePayload),
            restaurant_id: restaurantId,
          },
        })
      : Promise.resolve([] as MenuItemResponse[]),
    itemsToUpdate.length > 0
      ? httpClient("menu_items/bulk_update/", {
          method: "PATCH",
          body: {
            menu_items: itemsToUpdate.map(toUpdatePayload),
            restaurant_id: restaurantId,
          },
        })
      : Promise.resolve([] as MenuItemResponse[]),
  ]);

  return [
    ...unchanged,
    ...mapToMenuItems(createdDtos),
    ...mapToMenuItems(updatedDtos),
  ];
}

export function deleteMenuItem(itemId: string) {
  return httpClient(`menu_items/:id/`, {
    method: "DELETE",
    urlParams: {
      id: itemId,
    },
  });
}
