export type MenuItemClientState = "new" | "toUpdate";

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  clientState?: MenuItemClientState;
};
