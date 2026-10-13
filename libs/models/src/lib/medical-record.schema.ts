import { z } from "zod";

export const MedicationsSchema = z.object({
  name: z.string().describe('Medication name'),
  dosage: z.string().describe('Medication dosage'),
  duration: z.string().describe('Medication duration'),
  frequency: z.string().describe('Medication frequency')
});

export const ObservationsSchema = z.object({
  metricName: z.string().describe('Observed metric name'),
  metricValue: z.string().describe('Observed metric value'),
  recordedTime: z.coerce.date().describe('Time the metric was recorded')
});

export const MedicalRecordStatusSchema = z.enum(['Draft', 'Completed']);

export const MedicalRecordSchema = z.object({
  medicalRecordId: z.string().describe('Generated record id, e.g. REC-000001'),
  patientId: z.string().describe('Patient UHID'),
  appointmentId: z.string().describe('Related appointment id'),
  doctorId: z.string().describe('Doctor employee id'),
  complaint: z.string().optional().describe('Patient complaint'),
  symptoms: z.string().optional().describe('Observed symptoms'),
  diagnosis: z.string().optional().describe('Doctor diagnosis'),
  medications: z.array(MedicationsSchema).describe('Prescribed medications'),
  medicalObservations: z.array(ObservationsSchema).describe('Recorded medical observations'),
  notes: z.string().optional().describe('Additional notes'),
  status: MedicalRecordStatusSchema.optional().describe('Record status'),
  createdBy: z.string().describe('Creator employee id'),
  created_at: z.coerce.date().describe('Creation time'),
  updatedBy: z.string().optional().describe('Last updater employee id'),
  updatedAt: z.coerce.date().optional().describe('Last update time')
});

export const MedicalRecordListSchema = z.object({
  data: z.array(MedicalRecordSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
});

export const ListMedicalRecordsInputSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(50),
  patientId: z.string().min(1),
});

export type Medications = z.infer<typeof MedicationsSchema>;
export type Observations = z.infer<typeof ObservationsSchema>;
export type MedicalRecordStatus = z.infer<typeof MedicalRecordStatusSchema>;
export type MedicalRecordModel = z.infer<typeof MedicalRecordSchema>;
export type MedicalRecordList = z.infer<typeof MedicalRecordListSchema>;
export type ListMedicalRecordsInput = z.infer<typeof ListMedicalRecordsInputSchema>;
