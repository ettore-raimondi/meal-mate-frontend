import type { MenuItem } from ".";
import type { MenuItemResponse } from "./menu-item.types";
import { httpClient } from "../http";
import { mapToMenuItems } from "./menu-item.mapper";

const toCreatePayload = ({ clientState, id, ...rest }: MenuItem) => rest;

const toUpdatePayload = ({ clientState, imageUrl, ...item }: MenuItem) => ({
  ...item,
  image_url: imageUrl,
});

export async function scrapeMenuItems(websiteUrl: string): Promise<MenuItem[]> {
  const menuItemsDTO = await httpClient("menu_items/scrape/", {
    method: "GET",
    params: {
      restaurant_website_url: websiteUrl,
    },
  });
  return mapToMenuItems(menuItemsDTO);
}

export async function getMenuItemsForRestaurant(
  restaurantId: number,
): Promise<MenuItem[]> {
  return httpClient(`menu_items/restaurant/:restaurantId/`, {
    method: "GET",
    urlParams: {
      restaurantId: restaurantId.toString(),
    },
  });
}

export async function saveMenuItems(
  restaurantId: number,
  menuItems: MenuItem[],
) {
  const menuItemsDTO = await httpClient("menu_items/bulk_create/", {
    method: "POST",
    body: {
      menu_items: menuItems.map(toCreatePayload),
      restaurant_id: restaurantId.toString(),
    },
  });
  return mapToMenuItems(menuItemsDTO);
}

export async function updateMenuItems(
  restaurantId: number,
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
            restaurant_id: restaurantId.toString(),
          },
        })
      : Promise.resolve([] as MenuItemResponse[]),
    itemsToUpdate.length > 0
      ? httpClient("menu_items/bulk_update/", {
          method: "PATCH",
          body: {
            menu_items: itemsToUpdate.map(toUpdatePayload),
            restaurant_id: restaurantId.toString(),
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

export function deleteMenuItem(itemId: number) {
  return httpClient(`menu_items/:id/`, {
    method: "DELETE",
    urlParams: {
      id: itemId.toString(),
    },
  });
}
