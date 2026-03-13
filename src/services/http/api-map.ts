import type { AuthResponseDTO } from "../auth/auth.mapper";
import type { MenuItemDTO } from "../menu-item";
import type { RestaurantDTO } from "../restaurant";

/**
 * This type defines the structure of the API endpoints used in the application.
 * When calling an endpoint, the httpCLient derives the types from here.
 */
export type ApiEndpoints = {
  "token/": {
    POST: {
      response: AuthResponseDTO;
      body: {
        email: string;
        password: string;
      };
      params: never;
    };
  };
  "users/": {
    POST: {
      response: AuthResponseDTO;
      body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      };
      params: never;
    };
  };
  "token/refresh/": {
    POST: {
      response: AuthResponseDTO;
      body: {
        refresh: string;
      };
      params: never;
    };
  };
  "restaurants/places/": {
    GET: {
      response: RestaurantDTO[];
      body: never;
      params: {
        latitude: string;
        longitude: string;
      };
    };
  };
  "restaurants/": {
    POST: {
      response: RestaurantDTO;
      body: {
        name: string;
        address: string;
        phoneNumber: string;
        websiteUrl: string;
        description: string;
        imageUrl: string;
      };
      params: never;
    };
  };
  "scrape/menu-items/": {
    GET: {
      response: MenuItemDTO[];
      body: never;
      params: {
        restaurant_id: string;
      };
    };
  };
};
