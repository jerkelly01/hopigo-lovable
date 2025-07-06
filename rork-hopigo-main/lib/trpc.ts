import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // Provide fallback for missing environment variable
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Fallback URL for development/testing
  console.warn("EXPO_PUBLIC_RORK_API_BASE_URL not found, using fallback");
  return "https://api.example.com"; // Fallback URL
};

// Auth token storage
let authToken: string | undefined;

export const setAuthToken = (token: string | undefined) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: () => {
        // Add auth header if token exists
        const token = getAuthToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});