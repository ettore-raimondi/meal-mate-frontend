export type MenuItemResponse = {
  id: number;
  name: string;
  price: string;
  description: string;
  image_url?: string;
};

export type CreateMenuItemPayload = {
  name: string;
  price: string;
  description: string;
  image_url?: string;
};

export type UpdateMenuItemPayload = {
  id: number;
  name: string;
  price: string;
  description: string;
  image_url?: string;
};
