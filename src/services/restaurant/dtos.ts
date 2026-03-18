export type RestaurantDTO = {
  id: string;
  google_places_id?: string;
  created_at: string;
  deleted_at: string | null;
  name: string;
  address: string;
  phone_number: string;
  website_url: string;
  description: string;
  cuisine: string;
  menu?: any[];
};
