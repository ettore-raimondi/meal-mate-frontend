import type { RestaurantDTO, RestaurantEnriched } from ".";
import { mapToMenuItems } from "../menu-item/menu-item.mapper";

export function mapToRestaurants(restaurants: RestaurantDTO[]) {
  return restaurants.map((restaurant) => ({
    id: restaurant.id,
    googlePlacesId: restaurant.google_places_id,
    createdAt: restaurant.created_at,
    deletedAt: restaurant.deleted_at,
    name: restaurant.name,
    address: restaurant.address,
    phoneNumber: restaurant.phone_number,
    websiteUrl: restaurant.website_url,
    description: restaurant.description,
    menuItems: mapToMenuItems(restaurant.menu_items || []),
  }));
}

export function mapToEnrichedRestaurants(
  restaurants: ReturnType<typeof mapToRestaurants>,
): RestaurantEnriched[] {
  return restaurants;
}
