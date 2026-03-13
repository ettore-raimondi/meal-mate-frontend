export function fetchCoordinates(): Promise<
  { latitude: number; longitude: number } | undefined
> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      resolve(undefined);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Unable to retrieve location:", error.message);
          resolve(undefined);
        },
      );
    }
  });
}
