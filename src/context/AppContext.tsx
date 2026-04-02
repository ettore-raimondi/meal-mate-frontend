import { createContext } from "react";
import type { RestaurantEnriched } from "../services/restaurant";

export const AppContext = createContext<{
  restaurants: RestaurantEnriched[];
}>({
  // Define any global state or functions you want to share across components here
  restaurants: [],
});
