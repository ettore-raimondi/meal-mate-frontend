export type RunFormData = {
  id?: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  deadline: string;
};

export type RunFormValues = {
  name: string;
  restaurantId: string;
  deadline: string;
};

export type RunInitialValues = RunFormValues & {
  id?: string;
  restaurantLabel?: string;
};

export type RestaurantOption = {
  id: string;
  label: string;
};
