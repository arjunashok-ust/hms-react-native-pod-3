import { HostProvider } from "@hms/shared-util";
import { MicroAppProps } from "@hms/models";
import { HomeProvider } from "./providers/homeProviders";
import { SecureNavigator } from "./navigation/secureNavigator";

export const HomeMicroApp = ({ host }: MicroAppProps) => {
  return (
    <HostProvider host={host}>
      <HomeProvider>
        <SecureNavigator></SecureNavigator>
      </HomeProvider>
    </HostProvider>
  );
};
