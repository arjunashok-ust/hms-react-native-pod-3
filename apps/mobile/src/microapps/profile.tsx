import type { HostContext } from "@hms/models";
import { ProfileMicroApp } from "@hms/feature-profile";
import { useStoredPatientId } from "@hms/data-access";

export default function ProfileHost(){
    const patientId = useStoredPatientId();
    const host: HostContext = { patientId: patientId ?? null};
    return <ProfileMicroApp host={host} />
}