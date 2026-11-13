import { MicroAppProps } from "@hms/models";
import { HostProvider } from "@hms/shared-util";
import { SecureNavigator } from "./navigation/secureNavigator";
import { MedicalRecordProvider } from "./providers/medicalRecordProviders";

export function MedicalRecordMicroApp({ host }: MicroAppProps) {
  return (
    <HostProvider host={host}>
      <MedicalRecordProvider>
        <SecureNavigator></SecureNavigator>
      </MedicalRecordProvider>
    </HostProvider>
  );
}
