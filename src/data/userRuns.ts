export type RunStatus = "completed" | "in-progress";

export type UserRun = {
  id: string;
  name: string;
  restaurantId: string;
  restaurant: string;
  total: string;
  deliveredAt: string;
  deadline: string;
  status: RunStatus;
};

export const userRunsSeed: UserRun[] = [
  {
    id: "runh-301",
    name: "Finance Sprint Lunch",
    restaurantId: "rest-harvest",
    restaurant: "Harvest & Co.",
    total: "€86.40",
    deliveredAt: "Today · 11:55 AM",
    deadline: "2026-03-22T11:55",
    status: "in-progress",
  },
  {
    id: "runh-299",
    name: "Design Sync Lunch",
    restaurantId: "rest-lotus",
    restaurant: "Lotus Bowl",
    total: "€74.10",
    deliveredAt: "Yesterday · 1:22 PM",
    deadline: "2026-03-21T13:22",
    status: "completed",
  },
  {
    id: "runh-298",
    name: "Product AMA Snacks",
    restaurantId: "rest-ridgeway",
    restaurant: "Ridgeway Sandwich",
    total: "€58.25",
    deliveredAt: "Mar 8 · 4:35 PM",
    deadline: "2026-03-08T16:35",
    status: "completed",
  },
  {
    id: "runh-296",
    name: "Night Ops Fuel",
    restaurantId: "rest-seaside",
    restaurant: "Seaside Sushi",
    total: "€129.80",
    deliveredAt: "Mar 6 · 9:10 PM",
    deadline: "2026-03-06T21:10",
    status: "completed",
  },
];
