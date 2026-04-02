import type { MenuItem } from "../../../services/menu-item";

export type RestaurantFormState = {
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
};

export type MenuDraftState = {
  name: string;
  price: string;
  imageUrl: string;
  description: string;
};

export type MenuDraftMode = { type: "add" } | { type: "edit"; itemId: number };

export const emptyRestaurantForm: RestaurantFormState = {
  name: "",
  address: "",
  phoneNumber: "",
  websiteUrl: "",
  description: "",
};

export const emptyMenuDraft: MenuDraftState = {
  name: "",
  price: "",
  imageUrl: "",
  description: "",
};

export type RestaurantSelectionHandler = (restaurantId: number) => void;
export type MenuItemSelectionHandler = (menuItem: MenuItem) => void;
