import { ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { HostProvider } from "@hms/shared-util";
import type { HostContext } from "@hms/models";
import { HomeProvider } from "../lib/providers/homeProviders";

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

export function renderWithProviders(
  ui: ReactElement,
  host: HostContext = createHost(),
) {
  return {
    host,
    ...render(
      <HostProvider host={host}>
        <HomeProvider>{ui}</HomeProvider>
      </HostProvider>,
    ),
  };
}
