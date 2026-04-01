export type MenuItemClientState = "new" | "toUpdate";

export type MenuItem = {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  clientState?: MenuItemClientState;
};
