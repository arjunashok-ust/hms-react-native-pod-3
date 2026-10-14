import { AppointmentMicroApp } from "@hms/feature-appointments";
import { useStoredPatientId } from "@hms/data-access";
import type { HostContext } from "@hms/models";

export default function AppointmentHost(){
    const patientId = useStoredPatientId();
    const host: HostContext = { patientId: patientId ?? null};
    return <AppointmentMicroApp host={host} />
}
