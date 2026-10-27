import { HostProvider } from "@hms/shared-util";
import { Home } from "./screens/home/home";
import { MicroAppProps } from "@hms/models";

export const HomeMicroApp = ({ host }: MicroAppProps) => {
  return (
    <HostProvider host={host}>
      <Home />
    </HostProvider>
  );
};
