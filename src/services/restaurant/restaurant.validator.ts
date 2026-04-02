import type { RestaurantFormData } from ".";

export function validateNewRestaurant({
  name,
  address,
  phoneNumber,
}: RestaurantFormData) {
  const errors: string[] = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required.");
  }

  if (!address || address.trim() === "") {
    errors.push("Address is required.");
  }

  if (!phoneNumber || phoneNumber.trim() === "") {
    errors.push("Phone number is required.");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
}
