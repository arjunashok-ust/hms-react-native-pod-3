import { HomeMicroApp } from "@hms/feature-home";
import { useHostContext } from "./use-host-context";

export default function HomeHost() {
  const host = useHostContext();
  return <HomeMicroApp host={host} />;
}
