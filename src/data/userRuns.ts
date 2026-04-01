export type RunStatus = "completed" | "in-progress";

export type UserRun = {
  id: number;
  name: string;
  restaurantId: number;
  restaurant: string;
  total: string;
  deliveredAt: string;
  deadline: string;
  status: RunStatus;
};

export const userRunsSeed: UserRun[] = [
  {
    id: 301,
    name: "Finance Sprint Lunch",
    restaurantId: 101,
    restaurant: "Harvest & Co.",
    total: "€86.40",
    deliveredAt: "Today · 11:55 AM",
    deadline: "2026-03-22T11:55",
    status: "in-progress",
  },
  {
    id: 299,
    name: "Design Sync Lunch",
    restaurantId: 102,
    restaurant: "Lotus Bowl",
    total: "€74.10",
    deliveredAt: "Yesterday · 1:22 PM",
    deadline: "2026-03-21T13:22",
    status: "completed",
  },
  {
    id: 298,
    name: "Product AMA Snacks",
    restaurantId: 103,
    restaurant: "Ridgeway Sandwich",
    total: "€58.25",
    deliveredAt: "Mar 8 · 4:35 PM",
    deadline: "2026-03-08T16:35",
    status: "completed",
  },
  {
    id: 296,
    name: "Night Ops Fuel",
    restaurantId: 104,
    restaurant: "Seaside Sushi",
    total: "€129.80",
    deliveredAt: "Mar 6 · 9:10 PM",
    deadline: "2026-03-06T21:10",
    status: "completed",
  },
];
