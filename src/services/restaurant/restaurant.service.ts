import { httpClient } from "../http";
import {
  mapToRestaurants,
  validateNewRestaurant,
  type Restaurant,
  type RestaurantFormData,
} from ".";

export async function fetchRestaurantsNearMe(
  latitude: number,
  longitude: number,
) {
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
  googlePlacesId,
}: RestaurantFormData): Promise<Restaurant> {
  validateNewRestaurant({
    name,
    address,
    phoneNumber,
    websiteUrl,
    description,
    imageUrl,
    googlePlacesId,
  });

  const restaurantDTO = await httpClient(`restaurants/`, {
    method: "POST",
    body: {
      name,
      address,
      phone_number: phoneNumber,
      website_url: websiteUrl,
      description,
      image_url: imageUrl,
      google_places_id: googlePlacesId,
    },
  });

  return mapToRestaurants([restaurantDTO])[0];
}

export async function fetchRestaurants() {
  const restaurantDTOs = await httpClient("restaurants/", {
    method: "GET",
  });
  return mapToRestaurants(restaurantDTOs);
}

export async function deleteRestaurant(restaurantId: string) {
  await httpClient(`restaurants/:id/`, {
    method: "DELETE",
    urlParams: { id: restaurantId },
  });
}

export async function fetchRestaurantById(restaurantId: string) {
  const restaurantDTO = await httpClient(`restaurants/:id/`, {
    method: "GET",
    urlParams: { id: restaurantId },
  });
  return mapToRestaurants([restaurantDTO])[0];
}

export async function updateRestaurant(
  restaurantId: string,
  updatedData: Partial<RestaurantFormData>,
) {
  const restaurantDTO = await httpClient(`restaurants/:id/`, {
    method: "PATCH",
    urlParams: { id: restaurantId },
    body: {
      name: updatedData.name,
      address: updatedData.address,
      phone_number: updatedData.phoneNumber,
      website_url: updatedData.websiteUrl,
      description: updatedData.description,
      google_places_id: updatedData.googlePlacesId,
    },
  });
  return mapToRestaurants([restaurantDTO])[0];
}
