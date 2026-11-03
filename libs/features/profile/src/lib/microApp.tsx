import type { MicroAppProps } from "@hms/models";
import { HostProvider } from "@hms/shared-util";
import { SecureNavigator } from "./navigation/secureNavigator";
import { ProfileProvider } from "./providers/profileProviders";

export function ProfileMicroApp({ host }: MicroAppProps) {
  return (
    <HostProvider host={host}>
      <ProfileProvider>
        <SecureNavigator />
      </ProfileProvider>
    </HostProvider>
  );
}
