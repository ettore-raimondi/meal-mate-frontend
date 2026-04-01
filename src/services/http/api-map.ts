import type { AuthResponseDTO } from "../auth/auth.mapper";
import type {
  CreateMenuItemPayload,
  MenuItemResponse,
  UpdateMenuItemPayload,
} from "../menu-item";
import type { OrderRequestPayload, OrderResponse } from "../order/order.types";
import type { RestaurantDTO } from "../restaurant";
import type {
  CreateRunPayload,
  RunResponse,
  RunStatus,
} from "../run/run.types";

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
        phone_number: string;
        website_url: string;
        description: string;
        image_url?: string;
        google_places_id?: string;
      };
      params: never;
    };
    GET: {
      response: RestaurantDTO[];
      body: never;
      params: never;
    };
  };
  "restaurants/:id/": {
    DELETE: {
      response: never;
      body: never;
      params: never;
      urlParams: {
        id: string;
      };
    };
    GET: {
      response: RestaurantDTO;
      body: never;
      params: never;
      urlParams: {
        id: string;
      };
    };
    PATCH: {
      response: RestaurantDTO;
      body: Partial<RestaurantDTO>;
      urlParams: {
        id: string;
      };
    };
  };
  "menu_items/:id/": {
    DELETE: {
      response: never;
      body: never;
      params: never;
      urlParams: {
        id: string;
      };
    };
    GET: {
      response: MenuItemResponse;
      body: never;
      params: never;
      urlParams: {
        id: string;
      };
    };
    PATCH: {
      response: MenuItemResponse;
      body: Partial<MenuItemResponse>;
      urlParams: {
        id: string;
      };
    };
  };
  "menu_items/scrape/": {
    GET: {
      response: MenuItemResponse[];
      body: never;
      params: {
        restaurant_website_url: string;
      };
    };
  };
  "menu_items/restaurant/:restaurantId/": {
    GET: {
      response: MenuItemResponse[];
      body: never;
      params: never;
      urlParams: {
        restaurantId: string;
      };
    };
  };
  "menu_items/bulk_create/": {
    POST: {
      response: MenuItemResponse[];
      body: {
        menu_items: CreateMenuItemPayload[];
        restaurant_id: string;
      };
      params: never;
    };
  };
  "menu_items/bulk_update/": {
    PATCH: {
      response: MenuItemResponse[];
      body: {
        menu_items: UpdateMenuItemPayload[];
        restaurant_id: string;
      };
      params: never;
    };
  };
  "food_runs/": {
    POST: {
      response: RunResponse;
      body: {
        name: string;
        description?: string;
        restaurant: string;
        organizer: number;
        deadline: string;
        status: RunStatus;
      };
      params: never;
    };
    GET: {
      response: RunResponse[];
      body: never;
      params: never;
    };
  };
  "orders/": {
    POST: {
      response: OrderResponse;
      body: OrderRequestPayload;
    };
    GET: {
      response: OrderResponse[];
      body: never;
      params: never;
    };
  };
  "orders/latest/:foodRunId/": {
    GET: {
      response: OrderResponse | null;
      body: never;
      params: never;
      urlParams: {
        foodRunId: string;
      };
    };
  };
};
