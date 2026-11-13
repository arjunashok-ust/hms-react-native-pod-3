import type { MicroAppProps } from "@hms/models";
import { HostProvider } from "@hms/shared-util";
import { SecureNavigator } from "./navigation/secureNavigator";
import { AppointmentProvider } from "./providers/appointmentProvider";

export type AppointmentMicroAppProps = MicroAppProps & {
  initialDoctorId?: string;
};

export function AppointmentMicroApp({
  host,
  initialDoctorId,
}: AppointmentMicroAppProps) {
  return (
    <HostProvider host={host}>
      <AppointmentProvider>
        <SecureNavigator initialDoctorId={initialDoctorId}></SecureNavigator>
      </AppointmentProvider>
    </HostProvider>
  );
}
