import type { RestaurantDTO } from ".";

export function mapToRestaurants(restaurants: RestaurantDTO[]) {
  return restaurants.map((restaurant) => ({
    id: String(restaurant.id),
    googlePlacesId: restaurant.google_places_id,
    createdAt: restaurant.created_at,
    deletedAt: restaurant.deleted_at,
    name: restaurant.name,
    address: restaurant.address,
    phoneNumber: restaurant.phone_number,
    websiteUrl: restaurant.website_url,
    description: restaurant.description,
    cuisine: restaurant.cuisine,
    menu: restaurant.menu || [],
  }));
}
