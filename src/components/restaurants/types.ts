import { MenuItem } from "../homeTypes";

export type RestaurantFormState = {
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
  cuisine: string;
};

export type MenuDraftState = {
  name: string;
  price: string;
  imageUrl: string;
  description: string;
};

export type MenuDraftMode = { type: "add" } | { type: "edit"; itemId: string };

export const emptyRestaurantForm: RestaurantFormState = {
  name: "",
  address: "",
  phoneNumber: "",
  websiteUrl: "",
  description: "",
  cuisine: "",
};

export const emptyMenuDraft: MenuDraftState = {
  name: "",
  price: "",
  imageUrl: "",
  description: "",
};

export type RestaurantSelectionHandler = (restaurantId: string) => void;
export type MenuItemSelectionHandler = (menuItem: MenuItem) => void;
