import { createContext } from "react";
import { type Restaurant } from "../services/restaurant/restaurant.types";

export const AppContext = createContext<{
  restaurants: Restaurant[];
}>({
  // Define any global state or functions you want to share across components here
  restaurants: [],
});
