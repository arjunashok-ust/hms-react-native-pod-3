import { ReactElement } from "react";
import { render } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HostProvider } from "@hms/shared-util";
import type { HostContext } from "@hms/models";
import { AppointmentProvider } from "../lib/providers/appointmentProvider";

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

// A fresh QueryClient per call keeps cache from leaking between tests.
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

export function renderWithProviders(
  ui: ReactElement,
  host: HostContext = createHost(),
) {
  const queryClient = createTestQueryClient();
  return {
    host,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <HostProvider host={host}>
          <AppointmentProvider>{ui}</AppointmentProvider>
        </HostProvider>
      </QueryClientProvider>,
    ),
  };
}

export const makeAppointment = (overrides: Record<string, unknown> = {}) => ({
  appointmentId: "APT-1",
  patientId: "patient-1",
  doctorEmployeeId: "D1",
  date: new Date(2030, 0, 15).toISOString(),
  status: "Pending",
  timeSlot: "09:00",
  createdByEmployeeId: "E1",
  ...overrides,
});
