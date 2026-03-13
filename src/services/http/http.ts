import type { ApiEndpoints } from ".";
import { getAccessTokenWithRefreshToken } from "../auth/auth.service";

const SupportedHttpMethods = ["GET", "POST", "PUT", "DELETE"] as const;

export type HttpMethods = (typeof SupportedHttpMethods)[number];

type ApiEndpointPath = keyof ApiEndpoints;
type ApiEndpointMethod<P extends ApiEndpointPath> = keyof ApiEndpoints[P] &
  HttpMethods;
type ApiEndpointConfig<
  P extends ApiEndpointPath,
  M extends ApiEndpointMethod<P>,
> = ApiEndpoints[P][M];

type EndpointBody<P extends ApiEndpointPath, M extends ApiEndpointMethod<P>> =
  ApiEndpointConfig<P, M> extends { body: infer B } ? B : never;
type EndpointParams<P extends ApiEndpointPath, M extends ApiEndpointMethod<P>> =
  ApiEndpointConfig<P, M> extends { params: infer Q } ? Q : never;
type EndpointResponse<
  P extends ApiEndpointPath,
  M extends ApiEndpointMethod<P>,
> = ApiEndpointConfig<P, M> extends { response: infer R } ? R : never;

type HttpClientOptions<
  P extends ApiEndpointPath,
  M extends ApiEndpointMethod<P>,
> = {
  method: M;
  params?: EndpointParams<P, M>;
  body?: EndpointBody<P, M>;
  headers?: Record<string, string>;
};

export async function httpClient<
  P extends ApiEndpointPath,
  M extends ApiEndpointMethod<P>,
>(url: P, options: HttpClientOptions<P, M>): Promise<EndpointResponse<P, M>> {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("No api url provided, check your env file");
  }

  if (!options.method) {
    throw new Error(
      `Please use a supported http method: ${SupportedHttpMethods.join(", ")}`,
    );
  }

  const authTokenLocalStorage = localStorage.getItem("token");
  const body = options.body ? JSON.stringify(options.body) : undefined;

  // Convert params to query string if they exist, then add it to the url
  const queryString = options.params
    ? `?${new URLSearchParams(options.params).toString()}`
    : "";

  const makeRequest = async (accessToken: string | null) => {
    return fetch(`${apiUrl}/${url}${queryString}`, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(options.headers ?? {}),
      },
      ...(body && { body }),
    })
      .then()
      .catch((error) => {
        throw new Error(`Http request failed! Error: ${error.message}`);
      });
  };

  const response = await makeRequest(authTokenLocalStorage);

  if (response.status === 401) {
    try {
      const tokens = await getAccessTokenWithRefreshToken();
      localStorage.setItem("token", tokens.access);
      // Retry the original request with the new access token
      const retryResponse = await makeRequest(tokens.access);
      return retryResponse.json() as Promise<EndpointResponse<P, M>>;
    } catch {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(new Error("Unauthorized, redirecting to login..."));
    }
  }

  if (!response.ok) {
    throw new Error(
      `Http request failed! Status code: ${response.status}, error: ${await response.json()}`,
    );
  }

  return response.json() as Promise<EndpointResponse<P, M>>;
}
