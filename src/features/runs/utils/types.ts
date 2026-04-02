export type RunFormData = {
  id?: number;
  name: string;
  restaurantId: number;
  restaurantName: string;
  deadline: string;
};

export type RunFormValues = {
  name: string;
  restaurantId: number;
  deadline: string;
};

export type RunInitialValues = RunFormValues & {
  id?: number;
  restaurantLabel?: string;
};

export type RestaurantOption = {
  id: number;
  label: string;
};
