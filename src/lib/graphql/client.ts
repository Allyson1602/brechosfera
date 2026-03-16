import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export const DEFAULT_BAAZAR_IMAGE_URL = buildApiUrl("/uploads/defaults/bazar-1.svg");
export const DEFAULT_EVENT_IMAGE_URL = buildApiUrl("/uploads/defaults/evento-1.svg");

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: buildApiUrl("/graphql") }),
  cache: new InMemoryCache(),
});
