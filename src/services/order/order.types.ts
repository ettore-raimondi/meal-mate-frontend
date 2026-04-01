export type OrderRequestPayload = {
  food_run: number;
  user: number;
  menu_items: number[];
  note?: string;
};

// DTO or raw response from the backend
export type OrderResponse = {
  id: number;
  total: number;
  user: number;
  food_run: number;
  menu_items: number[];
  created_at: string;
  deleted_at?: string;
  restaurant_id: number;
  note: string;
  status: "in_progress" | "completed" | "cancelled";
};

// This is the type used in the frontend application after mapping from OrderResponse
export type Order = {
  id: number;
  total: number;
  user: number;
  foodRun: number;
  menuItems: number[];
  note: string;
  status: "in_progress" | "completed" | "cancelled";
  restaurantId: number;
  createdAt: Date;
  deletedAt?: Date;
};

// This type represents an Order enriched with additional information about the menu items, which can be useful for displaying order details in the UI.
export type OrderEnriched = Omit<Order, "menuItems"> & {
  createdAtFormatted: string; // A human-readable formatted date string for display purposes
  restaurant: {
    id: number;
    name: string;
  };
  menuItems: {
    id: number;
    name: string;
    price: string;
  }[];
};
