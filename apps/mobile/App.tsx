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
} from '@tanstack/react-query';
import {createTrpcClient, trpc} from "@hms/trpc-client";
import { useState } from "react";

const showApiError = (error: Error) => {
  Toast.show({
    type: "error",
    text1: "Failed",
    text2: error.message || "Something went wrong",
  });
};


export default function App() {
  const [fontsLoaded] = useFonts({
    Sans: require("./assets/fonts/GoogleSans.ttf"),
  });

  // Replaces the axios response interceptor's alert: every failed tRPC call shows its message.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: showApiError }),
        mutationCache: new MutationCache({ onError: showApiError }),
      }),
  );
  const [trpcClient] = useState(()=>createTrpcClient());

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
