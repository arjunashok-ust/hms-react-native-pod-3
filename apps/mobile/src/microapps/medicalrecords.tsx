import { MedicalRecordMicroApp } from "@hms/feature-medical-records";
import { useHostContext } from "./use-host-context";

export default function MedicalRecordsHost() {
  const host = useHostContext();
  return <MedicalRecordMicroApp host={host} />;
}
