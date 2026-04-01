export type OrderStatus = "paid" | "outstanding" | "in-progress";

export type OrderLineItem = {
  id: number;
  name: string;
  price: string;
};

export type Order = {
  id: number;
  restaurant: string;
  items: string;
  total: string;
  placedAt: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
};

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; tone: string }
> = {
  paid: { label: "Paid", tone: "success" },
  outstanding: { label: "Outstanding", tone: "muted" },
  "in-progress": { label: "In progress", tone: "progress" },
};

export const ORDER_STATUS_RANK: Record<OrderStatus, number> = {
  "in-progress": 0,
  outstanding: 1,
  paid: 2,
};

export const ordersSeed: Order[] = [
  {
    id: 1202,
    restaurant: "Sunset Tacos",
    items: "Roasted Cauli Tacos + Agua Fresca",
    total: "€19.25",
    placedAt: "Today · 12:10 PM",
    status: "in-progress",
    lineItems: [
      { id: 12021, name: "Roasted Cauli Tacos", price: "12.50" },
      { id: 12022, name: "Agua Fresca", price: "6.75" },
    ],
  },
  {
    id: 1201,
    restaurant: "Lotus Bowl",
    items: "Spicy Basil Pad Thai",
    total: "€18.40",
    placedAt: "Today · 11:05 AM",
    status: "paid",
    lineItems: [
      { id: 12011, name: "Spicy Basil Pad Thai", price: "14.50" },
      { id: 12012, name: "Lychee Iced Tea", price: "3.90" },
    ],
  },
  {
    id: 1200,
    restaurant: "Harvest & Co.",
    items: "Roasted Veggie Grain Bowl",
    total: "€15.10",
    placedAt: "Yesterday · 1:42 PM",
    status: "paid",
    lineItems: [
      { id: 12001, name: "Roasted Veggie Grain Bowl", price: "13.90" },
      { id: 12002, name: "Sparkling Water", price: "1.20" },
    ],
  },
  {
    id: 1198,
    restaurant: "Ridgeway Sandwich",
    items: "Turkey Club + Cold Brew",
    total: "€22.65",
    placedAt: "Mar 7 · 6:18 PM",
    status: "outstanding",
    lineItems: [
      { id: 11981, name: "Turkey Club", price: "11.50" },
      { id: 11982, name: "Cold Brew", price: "4.00" },
      { id: 11983, name: "Kettle Chips", price: "3.15" },
      { id: 11984, name: "Delivery Fee", price: "4.00" },
    ],
  },
  {
    id: 1195,
    restaurant: "Seaside Sushi",
    items: "Salmon Lovers Combo",
    total: "€27.90",
    placedAt: "Mar 5 · 12:05 PM",
    status: "paid",
    lineItems: [
      { id: 11951, name: "Salmon Lovers Combo", price: "24.90" },
      { id: 11952, name: "Matcha Mochi", price: "3.00" },
    ],
  },
];
