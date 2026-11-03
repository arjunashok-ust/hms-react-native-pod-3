import { useHost } from "@hms/shared-util";
import { trpc } from "@hms/trpc-client";

export function usePatientProfile() {
  const { email } = useHost();

  return trpc.user.getPatientProfile.useQuery(
    { email: email ?? "" },
    { enabled: !!email },
  );
}
