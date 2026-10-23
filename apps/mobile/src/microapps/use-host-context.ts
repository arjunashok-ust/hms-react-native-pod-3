import { useStoredPatientId } from "@hms/data-access";
import type { HostContext } from "@hms/models";
import { useMemo } from "react";

export function useHostContext(): HostContext {
    const patientId = useStoredPatientId();
    return useMemo(()=> ({patientId: patientId ?? null}), [patientId]);
}