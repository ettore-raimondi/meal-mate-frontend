import type { MenuItem, MenuItemResponse } from "../menu-item";
export type RestaurantDTO = {
  id: number;
  google_places_id?: string;
  created_at: string;
  deleted_at: string | null;
  name: string;
  address: string;
  phone_number: string;
  website_url: string;
  description: string;
  menu_items?: MenuItemResponse[];
};

export type Restaurant = {
  id: number;
  googlePlacesId?: string;
  createdAt: string;
  deletedAt: string | null;
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
  menuItems: MenuItem[];
};

export type RestaurantEnriched = Restaurant & {
  menuItems: MenuItem[];
};

export type RestaurantFormData = {
  googlePlacesId?: string;
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
  imageUrl?: string;
};
