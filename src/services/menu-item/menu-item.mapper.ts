import type { MenuItemResponse } from "./menu-item.api";
import type { MenuItem } from "./types";

export function mapToMenuItems(menuItems: MenuItemResponse[]): MenuItem[] {
  return menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description,
    imageUrl: item.image_url,
  }));
}
