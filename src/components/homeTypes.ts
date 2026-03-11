export type MenuItem = {
  id: string;
  name: string;
  price: string;
  available: boolean;
  description: string;
  imageUrl?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
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
