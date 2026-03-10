export type MenuItem = {
  id: string;
  name: string;
  price: string;
  available: boolean;
  description: string;
};

export type Restaurant = {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  menu: MenuItem[];
};

export type FoodRun = {
  id: string;
  name: string;
  restaurantId: string;
  organizer: string;
  cutoff: string;
  status: "Open" | "Closed" | "Draft";
  orders: number;
  eta: string;
};

export type PanelView = "runs" | "runDetail" | "menuDetail";
