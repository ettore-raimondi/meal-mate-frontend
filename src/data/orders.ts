export type OrderStatus = "paid" | "outstanding" | "in-progress";

export type Order = {
  id: string;
  restaurant: string;
  items: string;
  total: string;
  placedAt: string;
  status: OrderStatus;
};

export const ordersSeed: Order[] = [
  {
    id: "ord-1202",
    restaurant: "Sunset Tacos",
    items: "Roasted Cauli Tacos + Agua Fresca",
    total: "$19.25",
    placedAt: "Today · 12:10 PM",
    status: "in-progress",
  },
  {
    id: "ord-1201",
    restaurant: "Lotus Bowl",
    items: "Spicy Basil Pad Thai",
    total: "$18.40",
    placedAt: "Today · 11:05 AM",
    status: "paid",
  },
  {
    id: "ord-1200",
    restaurant: "Harvest & Co.",
    items: "Roasted Veggie Grain Bowl",
    total: "$15.10",
    placedAt: "Yesterday · 1:42 PM",
    status: "paid",
  },
  {
    id: "ord-1198",
    restaurant: "Ridgeway Sandwich",
    items: "Turkey Club + Cold Brew",
    total: "$22.65",
    placedAt: "Mar 7 · 6:18 PM",
    status: "outstanding",
  },
  {
    id: "ord-1195",
    restaurant: "Seaside Sushi",
    items: "Salmon Lovers Combo",
    total: "$27.90",
    placedAt: "Mar 5 · 12:05 PM",
    status: "paid",
  },
];
