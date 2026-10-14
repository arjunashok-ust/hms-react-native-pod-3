import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";
import type { AppRouter } from "./app-router";
import { trpc } from "./trpc";
import { TOKEN_KEY, tokenStorage } from "./token-storage";

// Web dev goes through the Metro proxy in metro.config.js (avoids CORS).
const API_URL =
  Platform.OS === "web" && __DEV__
    ? "/api/trpc"
    : process.env["EXPO_PUBLIC_API_URL"]!;

// The refresh token lives in an httpOnly cookie, so every request must send credentials.
const linkOptions = {
  url: API_URL,
  fetch: ((url, opts) =>
    fetch(url, { ...opts, credentials: "include" })) satisfies typeof fetch,
};

// Plain client with no auth header, used only to refresh the access token.
const refreshClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink(linkOptions)],
});

const isExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

let refreshInFlight: Promise<string | null> | null = null;

// Concurrent requests share one refresh call. A failed refresh clears the session token,
// so the original request goes out unauthenticated and the server answers UNAUTHORIZED.
const refreshAccessToken = (): Promise<string | null> => {
  refreshInFlight ??= refreshClient.auth.refreshToken
    .mutate()
    .then(async ({ token }) => {
      await tokenStorage.setItem(TOKEN_KEY, token);
      return token;
    })
    .catch(async () => {
      await tokenStorage.removeItem(TOKEN_KEY);
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
};

const getValidToken = async (): Promise<string | null> => {
  const token = await tokenStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  return isExpired(token) ? refreshAccessToken() : token;
};

export const createTrpcClient = () =>
  trpc.createClient({
    links: [
      httpBatchLink({
        ...linkOptions,
        async headers() {
          const token = await getValidToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
