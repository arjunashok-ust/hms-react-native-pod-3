import { ReactElement } from "react";
import { render } from "@testing-library/react-native";
import type { MedicalRecord } from "@hms/trpc-client";
import { MedicalRecordProvider } from "../lib/providers/medicalRecordProviders";

export function renderWithProviders(ui: ReactElement) {
  return render(<MedicalRecordProvider>{ui}</MedicalRecordProvider>);
}

export const createRecord = (
  overrides: Partial<MedicalRecord> = {},
): MedicalRecord =>
  ({
    medicalRecordId: "REC-000001",
    patientId: "P1",
    appointmentId: "APT-1",
    doctorId: "doc-42",
    complaint: "Headache",
    symptoms: "Nausea",
    diagnosis: "Migraine",
    medications: [],
    medicalObservations: [],
    notes: undefined,
    createdBy: "EMP-7",
    created_at: new Date(2024, 0, 15),
    ...overrides,
  }) as MedicalRecord;
