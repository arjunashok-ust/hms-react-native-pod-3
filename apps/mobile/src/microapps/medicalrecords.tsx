import { MedicalRecordMicroApp } from "@hms/feature-medical-records";
import { useStoredPatientId } from "@hms/data-access";
import type { HostContext } from "@hms/models";

export default function MedicalRecordsHost(){
    const patientId = useStoredPatientId();
    const host: HostContext = { patientId: patientId ?? null};
    return <MedicalRecordMicroApp host={host} />
}