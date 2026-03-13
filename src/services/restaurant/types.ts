export type Restaurant = {
  id: string;
  googlePlacesId: number;
  createdAt: string;
  deletedAt: string | null;
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
  cuisine: string;
  menu: any[];
};

export type RestaurantFormData = {
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
  imageUrl: string;
};
