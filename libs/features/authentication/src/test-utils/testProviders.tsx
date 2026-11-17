import { ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationProvider } from "../lib/providers/authenticationProvider";

// A fresh QueryClient per call keeps cache from leaking between tests.
export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AuthenticationProvider>{ui}</AuthenticationProvider>
      </NavigationContainer>
    </QueryClientProvider>,
  );
}
