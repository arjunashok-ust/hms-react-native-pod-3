import { z } from 'zod';
import { BLOOD_GROUPS, GENDERS, VALIDATION_MESSAGES as V } from './constants';
import { requiredString, emailSchema, dateSchema, paginationInput, paginated, messageOutput } from './common.schema';
import { employeeSchema, patientSchema, employeeProfileSchema } from './entities.schema';

// Inputs

export const emailInput = z.object({ email: emailSchema });

export const getPatientsInput = paginationInput;

export const patientIdInput = z.object({ patientId: requiredString(V.PATIENT_ID_REQUIRED) });

export const doctorIdInput = z.object({ doctorId: requiredString(V.DOCTOR_ID_REQUIRED) });

export const getAvailableTimeSlotsInput = z.object({
  employeeId: requiredString(V.EMPLOYEE_ID_REQUIRED),
  date: dateSchema(V.APPOINTMENT_DATE_REQUIRED),
});

export const updatePatientProfileInput = z.object({
  patientId: requiredString(V.PATIENT_ID_REQUIRED),
  name: requiredString(V.NAME_REQUIRED).optional(),
  gender: z.enum(GENDERS, { error: V.GENDER_INVALID }).optional(),
  dob: dateSchema(V.DOB_REQUIRED).optional(),
  address: requiredString(V.ADDRESS_REQUIRED).optional(),
  bloodGroup: z.enum(BLOOD_GROUPS, { error: V.BLOOD_GROUP_INVALID }).optional(),
  allergies: z.string().trim().optional(),
  emergencyContact: z.string().trim().optional(),
});

export const searchInput = z.object({ searchText: requiredString(V.SEARCH_TEXT_REQUIRED) });

// Outputs

export const patientProfileOutput = z.object({
  email: z.string(),
  status: z.string(),
  role: z.string(),
  isVerified: z.boolean().nullish(),
  uhid: z.string(),
  name: z.string(),
  gender: z.string().nullish(),
  dob: z.coerce.date().nullish(),
  allergies: z.string().nullish(),
  bloodGroup: z.string().nullish(),
  address: z.string().nullish(),
  phone: z.string().nullish(),
  emergencyContact: z.string().nullish(),
});

export const patientIdOutput = z.object({ patientId: z.string() });

export const availableSlotsOutput = z.object({ slots: z.array(z.string()) });

export const patientListOutput = paginated(patientSchema);
export const patientsOutput = z.array(patientSchema);
export const doctorsOutput = z.array(employeeSchema);
export const patientOutput = patientSchema;
export const doctorOutput = employeeSchema;
export const employeeProfileOutput = employeeProfileSchema;

export { messageOutput };
