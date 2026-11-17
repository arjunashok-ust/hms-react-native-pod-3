import { ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { HostProvider } from "@hms/shared-util";
import type { HostContext } from "@hms/models";
import { ProfileProvider } from "../lib/providers/profileProviders";

export const createHost = (
  overrides: Partial<HostContext> = {},
): HostContext => ({
  patientId: "patient-1",
  email: "patient@example.com",
  actions: {
    signOut: jest.fn().mockResolvedValue(undefined),
    bookAppointment: jest.fn(),
  },
  ...overrides,
});

// The screens take `navigation` as a prop, so no NavigationContainer is needed:
// tests pass `createNavigation()` instead.
export const createNavigation = () => ({ navigate: jest.fn() }) as never;

export function renderWithProviders(
  ui: ReactElement,
  host: HostContext = createHost(),
) {
  return {
    host,
    ...render(
      <HostProvider host={host}>
        <ProfileProvider>{ui}</ProfileProvider>
      </HostProvider>,
    ),
  };
}
