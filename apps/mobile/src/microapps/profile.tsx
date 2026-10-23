import { ProfileMicroApp } from "@hms/feature-profile";
import { useHostContext } from "./use-host-context";

export default function ProfileHost() {
  const host = useHostContext();
  return <ProfileMicroApp host={host} />;
}
