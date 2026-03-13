export function validateNewRestaurant({
  name,
  address,
  phoneNumber,
  websiteUrl,
  description,
  imageUrl,
}: {
  name: string;
  address: string;
  phoneNumber: string;
  websiteUrl: string;
  description: string;
  imageUrl: string;
}) {
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

  if (!websiteUrl || websiteUrl.trim() === "") {
    errors.push("Website URL is required.");
  }

  if (!description || description.trim() === "") {
    errors.push("Description is required.");
  }

  if (!imageUrl || imageUrl.trim() === "") {
    errors.push("Image URL is required.");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
}
