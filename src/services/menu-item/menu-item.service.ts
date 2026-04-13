import type { MenuItem } from ".";
import type { MenuItemResponse } from "./menu-item.types";
import { httpClient } from "../http";
import { mapToMenuItems } from "./menu-item.mapper";

const normalizePrice = (price: MenuItem["price"]): string => {
  if (typeof price !== "string") {
    return "0";
  }

  const trimmed = price.trim();
  if (!trimmed) {
    return "0";
  }

  const normalized = trimmed.replace(",", ".").replace(/[^0-9.\-]/g, "");
  const asNumber = Number.parseFloat(normalized);

  if (Number.isNaN(asNumber)) {
    return "0";
  }

  return asNumber.toString();
};

const toCreatePayload = ({ clientState, id, imageUrl, ...rest }: MenuItem) => {
  const normalizedPrice = normalizePrice(rest.price);
  const normalizedName = rest.name.trim();

  if (!normalizedName) {
    return null;
  }

  return {
    ...rest,
    name: normalizedName,
    price: normalizedPrice,
    image_url: imageUrl,
  };
};

const toUpdatePayload = ({ clientState, imageUrl, ...item }: MenuItem) => {
  const normalizedPrice = normalizePrice(item.price);
  const normalizedName = item.name.trim();

  if (!normalizedName) {
    return null;
  }

  return {
    ...item,
    name: normalizedName,
    price: normalizedPrice,
    image_url: imageUrl,
  };
};

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
  const menuItemsDTO = await httpClient(
    `menu_items/restaurant/:restaurantId/`,
    {
      method: "GET",
      urlParams: {
        restaurantId: restaurantId.toString(),
      },
    },
  );
  return mapToMenuItems(menuItemsDTO);
}

export async function saveMenuItems(
  restaurantId: number,
  menuItems: MenuItem[],
) {
  const createPayload = menuItems
    .map(toCreatePayload)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (createPayload.length === 0) {
    return [];
  }

  const menuItemsDTO = await httpClient("menu_items/bulk_create/", {
    method: "POST",
    body: {
      menu_items: createPayload,
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

  const createPayload = itemsToCreate
    .map(toCreatePayload)
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const updatePayload = itemsToUpdate
    .map(toUpdatePayload)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const [createdDtos, updatedDtos] = await Promise.all([
    createPayload.length > 0
      ? httpClient("menu_items/bulk_create/", {
          method: "POST",
          body: {
            menu_items: createPayload,
            restaurant_id: restaurantId.toString(),
          },
        })
      : Promise.resolve([] as MenuItemResponse[]),
    updatePayload.length > 0
      ? httpClient("menu_items/bulk_update/", {
          method: "PATCH",
          body: {
            menu_items: updatePayload,
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
