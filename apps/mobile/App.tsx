import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createTrpcClient, trpc } from "@hms/trpc-client";
import { useState } from "react";
import { clearSession, getStoredEmail } from "@hms/data-access";
import { TRPCClientError } from "@trpc/client";
import { navigationRef } from "./src/navigation/navigation-ref";

// The backend answers every 401 (wrong password, missing token, dead refresh) with code UNAUTHORIZED.
const isUnauthorized = (error: Error) =>
  error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED";

let isSigningOut = false;

// Parallel queries fail together; only the first one ends the session.
const endSession = async () => {
  if (isSigningOut) return;
  isSigningOut = true;
  try {
    await clearSession();
    queryClient.clear();
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: "auth" }] });
    }
  } finally {
    isSigningOut = false;
  }
};

const showApiError = async (error: Error) => {
  // A 401 only means "session is dead" when a user is signed in; a wrong password on the
  // login screen is also a 401 and must just show its message. The email is the marker:
  // a failed token refresh already deleted the token, but the email stays until clearSession().
  if (isUnauthorized(error) && (await getStoredEmail())) {
    await endSession();
    return;
  }
  Toast.show({
    type: "error",
    text1: "Failed",
    text2: error.message || "Something went wrong",
  });
};

// Replaces the axios response interceptor's alert: every failed tRPC call shows its message.
const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: showApiError }),
  mutationCache: new MutationCache({ onError: showApiError }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Sans: require("./assets/fonts/GoogleSans.ttf"),
  });

  const [trpcClient] = useState(() => createTrpcClient());

  if (!fontsLoaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
            <Toast />
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
