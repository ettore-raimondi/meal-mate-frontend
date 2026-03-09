const SupportedHttpMethods = ["GET", "POST", "PUT", "DELETE"] as const;

type HttpMethods = (typeof SupportedHttpMethods)[number];

type HttpClientOptions = {
  method: HttpMethods;
  body?: Record<string, string>;
  headers?: Record<string, string>;
};

export async function httpClient(url: string, options: HttpClientOptions) {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("No api url provided, check your env file");
  }

  if (!options.method) {
    throw new Error(
      `Please use a supported http method: ${SupportedHttpMethods.join(", ")}`,
    );
  }

  const authToken = localStorage.getItem("token");
  const body = options.body ? JSON.stringify(options.body) : undefined;

  const response = await fetch(`${apiUrl}/${url}`, {
    ...(body && { body }),
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...(options.headers ?? {}),
    },
  })
    .then()
    .catch((error) => {
      throw new Error(`Http request failed! Error: ${error.message}`);
    });

  if (!response.ok) {
    throw new Error(
      `Http request failed! Status code: ${response.status}, error: ${response.json()}`,
    );
  }

  return response.json();
}
