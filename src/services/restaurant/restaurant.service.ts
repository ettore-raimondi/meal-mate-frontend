import { httpClient } from "../http";
import {
  mapToRestaurants,
  validateNewRestaurant,
  type Restaurant,
  type RestaurantFormData,
} from ".";

export async function fetchRestaurants(latitude: number, longitude: number) {
  const restaurantDTOs = await httpClient(`restaurants/places/`, {
    method: "GET",
    params: { latitude: latitude.toString(), longitude: longitude.toString() },
  });

  return mapToRestaurants(restaurantDTOs);
}

export async function createRestaurant({
  name,
  address,
  phoneNumber,
  websiteUrl,
  description,
  imageUrl,
}: RestaurantFormData): Promise<Restaurant> {
  validateNewRestaurant({
    name,
    address,
    phoneNumber,
    websiteUrl,
    description,
    imageUrl,
  });

  const restaurantDTO = await httpClient(`restaurants/`, {
    method: "POST",
    body: {
      name,
      address,
      phoneNumber,
      websiteUrl,
      description,
      imageUrl,
    },
  });

  return mapToRestaurants([restaurantDTO])[0];
}
